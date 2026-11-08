/**
 * CSP Level 3 source matching for the headers this app sends.
 * Keyword sources do not authorize a network URL. Host wildcards match one or
 * more labels (`*.googleapis.com` matches `identitytoolkit.googleapis.com`
 * and not `googleapis.com`).
 */

export type CspDirective = string;

const DEFAULT_PORT: Record<string, string> = {
  "http:": "80",
  "https:": "443",
  "ws:": "80",
  "wss:": "443",
};

export function parseCsp(policy: string): Map<CspDirective, string[]> {
  const directives = new Map<CspDirective, string[]>();
  for (const part of policy.split(";")) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    const name = tokens[0].toLowerCase();
    directives.set(name, tokens.slice(1));
  }
  return directives;
}

/** Sources the browser uses for a request when a specific directive is absent. */
export function effectiveSources(
  directives: Map<CspDirective, string[]>,
  kind: "script" | "connect" | "frame" | "img"
): string[] {
  const pick = (...names: string[]) => {
    for (const name of names) {
      const sources = directives.get(name);
      if (sources) return sources;
    }
    return directives.get("default-src") ?? ["'none'"];
  };
  if (kind === "script") return pick("script-src-elem", "script-src", "default-src");
  if (kind === "connect") return pick("connect-src", "default-src");
  if (kind === "frame") return pick("frame-src", "child-src", "default-src");
  return pick("img-src", "default-src");
}

export function sourceAllowsUrl(
  sources: string[],
  requestUrl: string,
  documentUrl: string
): boolean {
  if (sources.length === 1 && sources[0] === "'none'") return false;
  const request = new URL(requestUrl);
  const document = new URL(documentUrl);
  return sources.some((source) => sourceMatches(source, request, document));
}

function sourceMatches(source: string, request: URL, document: URL): boolean {
  if (source === "*") return true;
  if (source === "'self'") return sameOrigin(request, document);
  if (source.startsWith("'")) return false;
  if (/^(nonce|sha256|sha384|sha512)-/i.test(source)) return false;
  if (/^[a-z][a-z0-9+.-]*:$/i.test(source)) return request.protocol === source.toLowerCase();

  const parsed = parseHostSource(source);
  if (!parsed) return false;
  if (parsed.scheme && request.protocol !== parsed.scheme) return false;
  if (!hostMatches(parsed.host, request.hostname)) return false;
  const port = request.port || DEFAULT_PORT[request.protocol] || "";
  const expectedPort = parsed.port || (parsed.scheme ? DEFAULT_PORT[parsed.scheme] : "") || "";
  if (expectedPort && port !== expectedPort) return false;
  return pathMatches(parsed.path, request.pathname);
}

function sameOrigin(request: URL, document: URL): boolean {
  const requestPort = request.port || DEFAULT_PORT[request.protocol] || "";
  const documentPort = document.port || DEFAULT_PORT[document.protocol] || "";
  return (
    request.protocol === document.protocol &&
    request.hostname === document.hostname &&
    requestPort === documentPort
  );
}

function parseHostSource(source: string): { scheme: string; host: string; port: string; path: string } | null {
  const match = /^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*|(\*\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*)(?::(\*|\d+))?(\/[^?\s]*)?$/i.exec(
    source
  );
  if (!match) return null;
  return {
    scheme: match[1] ? `${match[1].toLowerCase()}:` : "",
    host: match[2].toLowerCase(),
    port: match[4] ?? "",
    path: match[5] ?? "",
  };
}

function hostMatches(expression: string, host: string): boolean {
  const hostname = host.toLowerCase();
  if (expression === "*") return true;
  if (expression.startsWith("*.")) {
    const suffix = expression.slice(1);
    return hostname.length > suffix.length && hostname.endsWith(suffix);
  }
  return hostname === expression;
}

function pathMatches(expressionPath: string, urlPath: string): boolean {
  if (!expressionPath || expressionPath === "/") return true;
  if (expressionPath.endsWith("/")) return urlPath.startsWith(expressionPath);
  return urlPath === expressionPath;
}
