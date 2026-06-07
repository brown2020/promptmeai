# AGENTS.md

Authoritative operating guide for autonomous coding agents (Codex, Cursor, etc.) working in this repository. This file is the single source of truth for agent behavior. Read it fully before making any change.

For product scope, current-state inventory, and roadmap, see [`spec.md`](./spec.md).

---

## Project overview

**Prompt.me AI** is an open-source web app that sends one prompt to five large language models at once and streams all five responses side-by-side in real time. It is a single-purpose comparison tool, not a general chat client: every prompt fans out to every configured model so users can compare quality, tone, speed, and correctness.

The app is a Next.js App Router project that runs almost entirely on the client. Server-side code is limited to two thin server-action modules (AI streaming and Stripe payment intents) plus Firebase Admin auth verification. Firebase (Auth + Firestore) is the backend; Stripe handles credit purchases.

## Product purpose

- Let researchers, developers, and AI enthusiasts compare leading models on the same prompt without juggling multiple tabs or API consoles.
- Support two ways to pay for inference: platform **credits** (billed against a token estimate) or the user's **own API keys**.
- Persist comparison conversations so they can be revisited, pinned, searched, and deleted.

## Current tech stack

- **Framework**: Next.js 16 (App Router) with React 19, TypeScript (strict).
- **Styling/UI**: Tailwind CSS 4 (via `@tailwindcss/postcss`), NextUI (`@nextui-org/react`), Framer Motion, `lucide-react` + `react-icons`.
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/rsc`) with provider packages `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/mistral`. Streaming uses `streamText` + `createStreamableValue`.
- **Backend/data**: Firebase Web SDK (`firebase`) client-side, Firebase Admin (`firebase-admin`) server-side, Firestore for data, Firebase Auth for identity.
- **Payments**: Stripe (`stripe` server SDK, `@stripe/react-stripe-js` + `@stripe/stripe-js` client).
- **State**: Zustand 5 (multiple small stores, no persistence middleware).
- **Validation**: Zod 4 (a transitive requirement of the AI SDK; not yet used for app-level schemas).
- **Tooling**: ESLint 9 (`eslint-config-next`), TypeScript compiler for typechecking. Package manager is **npm** (lockfile: `package-lock.json`, `.npmrc` sets `legacy-peer-deps=true`).

> Always trust `package.json` over prose for exact versions. Do not switch package managers.

## Repository structure

```
src/
├── actions/        # "use server" server actions (generateActions, paymentActions)
├── app/            # App Router routes: /, /chat, /settings, /payment-*, /loginfinish, /terms, /privacy, /support
│   ├── providers.tsx   # Client providers + client-side auth redirect gate (PUBLIC_PATHS)
│   ├── layout.tsx      # Root layout (server) wrapping Providers + Layout
│   └── globals.css     # Tailwind layers + design-system CSS variables / utility classes
├── components/     # Reusable UI (Button, Input, modals, MarkdownRenderer, AuthComponent, ...)
├── constants/      # modelNames (MODEL_CONFIG), modelColors, menuItems, designTokens
├── firebase/       # firebaseClient, firebaseAdmin (verifyAuth), paths (Firestore path builders)
├── hooks/          # useAuthToken (cookie/token sync), useActiveRequestWarning, useTypingEffect
├── layouts/        # Layout (3-panel), LeftPanel, BottomPanel, navigation buttons
├── screens/        # Page-level UI grouped by route, each with sections/ and components/
├── services/       # chatService (Firestore chat CRUD, JSON-serialized messages)
├── types/          # chat.ts + ambient .d.ts (globals, svg, menu)
├── utils/          # token, logger, text, number, object, tailwind, routes (isPublicPath)
├── zustand/        # auth, profile, credits, account, chat, chatSideBar, payments, platform stores
└── proxy.ts        # Server-side route protection (Next.js 16 Proxy / Middleware)
```

Root config: `next.config.mjs`, `tsconfig.json` (`@/*` → `./src/*`), `eslint.config.mjs`, `postcss.config.mjs`, `firestore.rules`, `storage.rules`, `.env.example`.

## Core architecture overview

- **Client-first SPA.** Nearly every route component is `"use client"`. The root `app/layout.tsx` is the only meaningful server component.
- **Auth flow.** `useAuthToken` (used in `providers.tsx`) listens to Firebase Auth, writes the Firebase ID token into a cookie (name from `NEXT_PUBLIC_COOKIE_NAME`, default `authToken`), and refreshes it every 50 minutes. Server actions call `verifyAuth()` (`firebaseAdmin.ts`) which reads that cookie and verifies the ID token with the Admin SDK, returning the uid.
- **Route protection runs server-side in `src/proxy.ts`** (Next.js 16 Proxy, formerly Middleware; Node.js runtime). The proxy redirects unauthenticated requests for non-public routes to `/` before the page renders, using the shared `isPublicPath` matcher (`src/utils/routes.ts`) and a presence check on the auth cookie. This is a coarse routing gate; the authoritative trust boundary is still `verifyAuth()` in the server actions (full ID-token verification), not the proxy.
- **Generation fan-out.** `ChatInput` reads the current conversation, then calls the `continueConversation` server action once per model via `Promise.allSettled`. The action resolves a provider+model from `MODEL_CONFIG`, picks the API key (env key in credits mode, user key in API-keys mode via `resolveApiKey`), and returns a streamable value the client reads with `readStreamableValue`.
- **Credits.** `utils/token.ts` estimates tokens (~4 chars/token) and converts to credits at a flat rate. After a successful generation in credits mode, the client calls `reduceCredits` (`useCreditsStore`, Firestore transaction). Credit accounting is currently **client-initiated**, not enforced inside the server action (see "extra caution").
- **Persistence.** Chats are stored under `promptme_chats/{uid}/chat/{id}` as a JSON-serialized `Message[]` string. Profile lives at `users/{uid}/profile/userData`; payments at `users/{uid}/payments/{id}`. All Firestore path strings come from `firebase/paths.ts`.
- **Mobile webview awareness.** `usePlatformStore` detects `window.ReactNativeWebView`; some web-only UI (Google sign-in, API-key entry) is hidden inside a React Native webview wrapper.

## Key app features that exist today

- Five-model side-by-side streaming comparison (OpenAI GPT, Anthropic Claude, Google Gemini, Mistral, Meta LLaMA via Fireworks's OpenAI-compatible endpoint).
- Stop/abort an in-flight generation (`AbortController` per request).
- Chat history with create, update, pin/unpin, delete, and debounced search.
- Dual usage modes: platform credits or bring-your-own API keys, switchable in Settings.
- Stripe credit purchase flow (`/payment-attempt` → `/payment-success`) with payment history.
- Firebase Auth: Google popup, email/password, and email-link sign-in; sign-out with explicit cookie deletion; account deletion.
- Light/dark/system theme, responsive 3-panel layout, cookie-consent banner, static legal/support pages.

## Important commands

```bash
npm install          # install deps (respects .npmrc legacy-peer-deps)
npm run dev          # Next dev server (DO NOT run in autonomous validation; it watches)
npm run build        # production build (also typechecks + lints route output)
npm run start        # serve a production build
npm run lint         # ESLint over the repo
npx tsc --noEmit     # standalone typecheck (no dedicated npm script exists)
```

### Canonical validation/check command

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Run this before declaring any change done. `npm run lint` and `npx tsc --noEmit` are fast; `npm run build` is the strongest signal and requires environment variables (see below).

### Non-interactive testing rules

- There is **no test suite, no test runner, and no CI workflow** in this repo today. Do not claim tests pass.
- Never start watch mode (`npm run dev`, `tsc --watch`, `eslint --watch`) during validation.
- Never launch a headed browser, never require manual login, never wait for human input.
- `npm run build` needs env vars (Firebase Admin + provider keys are referenced at import time). A local `.env` / `.env.local` already exists; rely on it. If a clean environment lacks them, copy `.env.example` and document that the build could not be fully validated rather than inventing secrets.
- If a check cannot run, state that explicitly in your report instead of skipping silently.

## Development conventions

- **TypeScript**: strict mode is on. No `any` escape hatches; prefer precise types, discriminated unions, and `satisfies` (see `MODEL_CONFIG`). Keep `npx tsc --noEmit` clean.
- **Lint**: keep `npm run lint` clean. Follow `eslint-config-next` (includes React hooks + a11y rules).
- **Components**: functional components only, no classes. Default-export the screen/page component; co-locate `sections/` and `components/` under each screen. Reusable primitives live in `src/components`.
- **Imports**: use the `@/` path alias for anything under `src`.
- **Naming**: directories use lowercase-with-dashes (`chat-detail`, `navigation-buttons`); components use PascalCase; hooks use `useX`; booleans use `is/has` prefixes.
- **Styling**: Tailwind utilities plus the shared classes/CSS variables defined in `app/globals.css` and `constants/designTokens.ts`. Reuse existing tokens before adding ad-hoc colors.
- **Logging**: use `src/utils/logger.ts`, not raw `console.*`, for app logging (server actions currently use `console.error` for fatal paths — acceptable but prefer `logger` where possible).
- **Comments**: only for non-obvious intent. Do not narrate code.

### Server/client boundary guidance

- Server-only code must live in `src/actions/*` (files start with `"use server"`) or modules that import `firebase/firebaseAdmin`. **Never import `firebaseAdmin` into a client component** — it pulls in the Admin SDK and secrets.
- Every server action must call `await verifyAuth()` as its first statement and validate its inputs before doing work (existing actions do this).
- Client components must not read server secrets. Only `NEXT_PUBLIC_*` env vars are safe on the client.
- Streaming responses cross the boundary via `@ai-sdk/rsc` (`createStreamableValue` on the server, `readStreamableValue` on the client). Preserve this pattern for new model interactions.

### Route-protection guidance

- Page-level protection lives in `src/proxy.ts` (server-side). It redirects unauthenticated requests for non-public routes to `/` based on the auth cookie. Treat the proxy as the routing gate, not as the security boundary.
- The real trust boundary is the server action + Firestore security rules (`firestore.rules`, `storage.rules`). Any new sensitive capability must enforce auth in the server action via `verifyAuth()` and be covered by Firestore rules — never rely on the proxy alone (it only checks cookie presence, not token validity).
- Public/protected matching is centralized in `src/utils/routes.ts` (`PUBLIC_PATHS` + `isPublicPath`), which is unit-tested and shared by the proxy. If you add a public route, update `PUBLIC_PATHS` there. If you add a route that must be hidden from the panel chrome, update `hidePanelPaths` in `layouts/Layout.tsx`.
- The proxy `config.matcher` excludes Next internals and static assets; keep it in sync if you add asset paths that must stay public.

### State-management guidance

- Use Zustand. Keep stores small and focused (mirror the existing split: `useAuthStore`, `useProfileStore`, `useCreditsStore`, `useAccountStore`, `useChatStore`, `useChatSideBarStore`, `usePaymentsStore`, `usePlatformStore`).
- Cross-store access uses `Store.getState()` / dynamic `import()` to avoid cycles (see `useProfileStore` delegating to `useCreditsStore`/`useAccountStore`). Follow that pattern instead of importing store modules eagerly into each other.
- Mutations must be immutable. Firestore-backed writes should update optimistically and roll back on error (see `updateProfile`).
- Credit and balance mutations must use Firestore **transactions** (see `useCreditsStore`) to avoid race conditions.

### Testing expectations

- No automated tests exist. If you add logic that is easy to unit test (token math, credit conversion, serialization, path builders), adding focused tests is welcome but **introducing a test framework is a product/infra decision** — only do it if the task explicitly calls for it, and wire a non-interactive `test` script (e.g. `vitest run`) if you do.
- Until then, validation = lint + typecheck + build, plus a manual reasoning pass over the changed user flow.

## Files and systems requiring extra caution

- `src/firebase/firebaseAdmin.ts` — server-only, holds Admin credential init and `verifyAuth`. Never import client-side; never log secrets.
- `src/actions/generateActions.ts` & `src/actions/paymentActions.ts` — the only privileged server entry points. Keep `verifyAuth()` first and validate inputs.
- `src/zustand/useCreditsStore.ts` & `src/utils/token.ts` — billing logic. Credit deduction is currently client-initiated and based on a character-count token estimate, so it is **not authoritative**; changes here have real money/abuse implications. Do not make charging looser; tightening (server-side enforcement) is a roadmap item.
- `src/zustand/usePaymentsStore.ts` & payment screens — payment recording happens client-side after Stripe success; there is **no Stripe webhook**. Be careful not to introduce double-credit or unverified-credit paths.
- `firestore.rules` / `storage.rules` — the actual security boundary. Any new collection/field must be reflected here.
- `src/firebase/paths.ts` — all Firestore paths funnel through here; keep new paths centralized.
- `.env`, `.env.local`, `.env.example`, `service_key.json` — secret-bearing. Never commit real secrets or print their contents.
- `package-lock.json` — generated; only change via npm.

## Git workflow expectations

- `main` is the stable production branch. **Never push to `main`** and never force-push.
- `dev` is the working branch. Commit and push your work to `origin/dev`.
- Before working: `git fetch --all`, `git checkout dev`, `git pull origin dev`, inspect the working tree. If uncommitted changes exist that you did not create, document them and stop unless clearly safe to preserve.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `perf:`, `test:`).
- Do not open PRs or merge into `main` unless the task explicitly asks.

## Definition of done

A change is done when:

1. It implements exactly the requested scope — one focused, PR-sized change.
2. `npm run lint` is clean.
3. `npx tsc --noEmit` is clean.
4. `npm run build` succeeds (or you have documented precisely why it could not run).
5. The server/client boundary, auth (`verifyAuth`), and Firestore-rule implications are respected.
6. No secrets, generated files, or unrelated files are committed.
7. Docs that describe the changed behavior (`README.md`, `spec.md`) are updated when behavior changes.
8. Work is committed to `dev` with a Conventional Commit message and pushed to `origin/dev`.

## Rules for autonomous Codex runs

- Make **one focused, PR-sized change per run**, even though commits go directly to `dev`. Do not bundle unrelated work.
- Start from the roadmap in [`spec.md`](./spec.md): pick the highest-priority item whose dependencies are met.
- Read before you write: inspect the relevant code paths (this guide names them) rather than trusting docs alone.
- Prefer completing or improving an existing product capability over generic cleanup/refactors. Do not generate large lint/test/refactor backlogs as "work."
- Keep diffs minimal and reviewable. Match existing patterns and file organization.
- Always run the canonical validation command before committing. Fix what you broke.
- Update `spec.md` and/or `README.md` when you change user-facing behavior.
- Commit with `docs:`/`feat:`/`fix:` etc. as appropriate, push to `origin/dev`, then stop.

## Stop conditions

Stop and report (do not guess or thrash) when:

- The working tree has pre-existing uncommitted changes you did not create.
- A change would require pushing to `main`, force-pushing, or rewriting shared history.
- A task needs new secrets, new paid services, or a new external dependency that is not clearly in scope.
- `npm run build` cannot run because required environment variables are absent in the environment.
- A change would weaken the auth/credit/payment trust boundary, or you cannot verify it is safe.
- You have attempted the same fix ~3 times without progress, or the request is ambiguous enough that proceeding risks the wrong outcome.
- The change grows beyond one focused, PR-sized unit — split it and do the first part.
