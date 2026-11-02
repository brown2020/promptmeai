# Prompt.me AI — roadmap

Punchlist after the October 28, 2026 maintenance pass. Nothing here is scheduled. Open GitHub issues: none.

## Next product work

1. **Choose models per comparison.** The fan-out always hits all three ids in `MODEL_CONFIG`. Let a signed-in user turn models off, persist that choice, and keep at least one on.
2. **Copy and export.** Add copy on one answer and a Markdown download of the prompt plus every answer, including history.
3. **Bill provider usage.** Replace the character estimate in `src/utils/token.ts` with provider `usage` when the stream reports it. Keep the estimate as the fallback and show the numbers on the card.
4. **First-run empty state.** Example prompts that fill the input, plus one line on credits versus API keys and the current balance.

## Known bugs and limits

- Credit math is still `round(characters / 4 * 0.004)`, with a minimum of 1 for a non-empty reply. Short and long answers can be over- or under-charged versus the provider invoice.
- Each model call reserves the full bounded prompt plus the maximum output. A three-model comparison holds that amount three times until the refunds land.
- `sendEmailVerification` errors are ignored. A user who never gets the mail stays at 0 credits until a later verified `ensureUserProfile`.
- App Check is not enforced by this repo. It only initializes when `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` is set, and enforcement is a console switch.
- The Stripe webhook does nothing until `STRIPE_WEBHOOK_SECRET` is set. Grants then depend on the browser reaching `/payment-success`.
- `@firebase/firestore` and `@firebase/auth` declare `node >= 24.12.0`. CI uses Node 24. `require("firebase-admin/auth")` loads on Node 24.22.
- Typecheck (`tsc`) is TypeScript 7.0.2 (`@typescript/native`). Next 16.4.3 still loads `typescript/lib/typescript.js` and suggests `typescript@^6`. TypeScript 7 does not ship that file, so the `typescript` package stays on `@typescript/typescript6` 6.0.2.
- `date-fns` 5 is only `5.0.0-alpha.0`. The app stays on 4.4.0, the latest stable. Next 16.5 and Firebase 13.2 are prereleases; the app stays on Next 16.4.3 and Firebase 13.1.0.

## Dependency audit

`npm audit` reports 13 low findings, all `@nextui-org/*` via `deepmerge` `>=4.2.0` (prototype pollution in `mergeObject`). No moderate, high, or critical findings. `npm audit fix` does not clear the lows: `@nextui-org/theme` and `@nextui-org/react` have no patched release. `@heroui/react` 3 no longer depends on `deepmerge`, but it is a different component API (no drop-in `NextUIProvider`, Modal, or Dropdown). That migration is a UI change, not a safe bump.

`minimatch` `<11.0.1` and `glob` `<=14.0.1` were moderate findings. Overrides pin `minimatch@^11.0.4` and `glob@^14.0.3`. `npm audit fix --force` would downgrade ESLint to 4; that was not applied. ESLint stays on 10.14.0.

## Do not do casually

- Do not change `gpt-6.1-sol`, `claude-opus-5-5`, or `gemini-4-argon` unless a provider retires the id.
- Do not remove the `jwks-rsa` → `jose@5.10.0` override while `firebase-admin` 14 and `jwks-rsa` 4 are installed. `jose` 6 is ESM-only and crashes `require()` inside `jwks-rsa`.
- Do not remove the `minimatch@^11.0.4` or `glob@^14.0.3` overrides while those advisories still cover the versions ESLint and `rimraf` would otherwise install.
- Do not deploy Firebase rules or change Vercel env from a docs or dependency pass.
