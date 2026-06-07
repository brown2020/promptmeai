# Prompt.me AI — Product Specification & Roadmap

This is the single authoritative product/spec/roadmap document for Prompt.me AI. It consolidates what previously lived across `README.md`, `CLAUDE.md`, and inline roadmap notes. For agent/engineering operating rules, see [`AGENTS.md`](./AGENTS.md).

Conclusions inferred from the codebase (rather than stated in prior docs) are marked **(inferred)**.

---

## 1. Product overview

### Product promise

Send one prompt to multiple leading AI models at once and watch their answers stream in side-by-side, so you can instantly compare how different models respond to the same question.

### Target users

- **AI researchers & evaluators** comparing model quality, tone, reasoning, and refusal behavior on identical prompts.
- **Developers** deciding which provider/model to ship, or sanity-checking outputs across providers.
- **AI enthusiasts / power users** who want one place to query several models without separate accounts and tabs.

### Core workflows

1. **Sign in** (Google, email/password, or email link).
2. **Ask once, compare many**: type a prompt; it is sent to all five configured models in parallel and each response streams into its own card.
3. **Pay for inference** either with platform **credits** or with the user's **own provider API keys** (chosen in Settings).
4. **Manage conversations**: comparisons auto-save to history; pin, search, revisit, or delete them.
5. **Top up**: buy credits through Stripe when the balance runs low.

### Product goals

- Make multi-model comparison effortless and fast (real-time streaming, no setup beyond sign-in).
- Offer a low-friction default (credits) and a power-user path (bring-your-own-keys).
- Keep conversation history durable, organized, and searchable.
- Stay provider-agnostic so new models can be added with minimal change.

---

## 2. Current application state

### What the app currently does

Prompt.me AI is a client-first Next.js (App Router) single-page application backed by Firebase (Auth + Firestore) and Stripe. Authenticated users submit a prompt that fans out to five models via a single server action; responses stream back per model and the full comparison is persisted to Firestore.

### Current feature inventory

- **Multi-model comparison** across 5 models (current `MODEL_CONFIG`):
  - GPT-5.1 Chat — OpenAI
  - Claude Sonnet 4.5 — Anthropic
  - Gemini 2.5 Flash — Google
  - Mistral Small — Mistral
  - LLaMA 3.1 8B Instruct — Meta, via Fireworks's OpenAI-compatible endpoint
- **Real-time streaming** via Vercel AI SDK (`streamText` + `@ai-sdk/rsc` streamable values).
- **Parallel fan-out** with per-request abort/stop (`Promise.allSettled` + `AbortController`).
- **Dual usage modes**: platform **credits** or **user-supplied API keys**, toggled in Settings.
- **Chat history**: auto-save, update, pin/unpin, debounced search, delete.
- **Credit system**: token estimate (~4 chars/token) → flat-rate credit cost; balance decremented via Firestore transactions.
- **Payments**: Stripe PaymentIntent creation/validation server actions; credit purchase flow (`/payment-attempt` → `/payment-success`); payment history.
- **Authentication**: Google popup, email/password, and email-link sign-in; password reset; sign-out with explicit cookie deletion; account deletion.
- **Settings**: usage-mode selection, credit information, API-key entry, payment history, account options.
- **UX**: responsive 3-panel layout, light/dark/system themes, markdown rendering of responses, cookie-consent banner, static legal/support pages.
- **Mobile webview awareness**: detects React Native WebView and hides web-only UI (Google sign-in, API-key entry) **(inferred: supports an external mobile wrapper / in-app-purchase path; no IAP code is present in this repo)**.

### Current user flows

- **New user**: land on `/` → sign in → redirected to `/chat` → profile auto-created in Firestore with a starting credit balance (default 1000) → prompt → compare.
- **Returning user**: auth cookie/token restored → profile + chat list loaded → resume or start a comparison.
- **Out of credits**: a warning modal prompts the user to buy credits or switch to API keys, deep-linking to `/settings`.
- **Buy credits**: Settings → purchase → Stripe checkout → payment recorded → credits added.

### Existing integrations

- **Firebase Auth** — identity (Google, email/password, email link).
- **Firebase Firestore** — profiles, chats, payments. Paths centralized in `src/firebase/paths.ts`:
  - `users/{uid}/profile/userData`
  - `users/{uid}/payments/{id}`
  - `promptme_chats/{uid}/chat/{id}` (messages stored JSON-serialized)
- **Firebase Admin SDK** — server-side ID-token verification (`verifyAuth`).
- **AI providers** via Vercel AI SDK — OpenAI, Anthropic, Google, Mistral, and Fireworks (OpenAI-compatible).
- **Stripe** — PaymentIntents for credit purchases.

### Current architecture summary

- **Next.js 16 App Router, React 19, TypeScript (strict)**; almost all routes are `"use client"` and build to static output **(inferred from build output: all routes prerender as static)**.
- **Two server actions only**: `generateActions.ts` (AI streaming) and `paymentActions.ts` (Stripe). Both call `verifyAuth()` first.
- **Auth bridging**: `useAuthToken` writes the Firebase ID token to a cookie and refreshes it every 50 minutes; server actions verify that cookie via the Admin SDK.
- **State**: Zustand stores split by concern (`auth`, `profile`, `credits`, `account`, `chat`, `chatSideBar`, `payments`, `platform`); no persistence middleware (auth persists via Firebase + cookie).
- **Security boundary**: Firestore/Storage rules (`firestore.rules`, `storage.rules`) scope every document to its owning uid; server actions enforce auth.
- **Styling**: Tailwind 4 + NextUI, shared design tokens/CSS variables.

### Existing technical constraints

- No `middleware.ts`; **route protection is client-side only** (redirect in `providers.tsx`). The real trust boundary is server actions + Firestore rules.
- No test suite, no test runner, and no CI workflow.
- `npm run build` requires environment variables (Firebase Admin + provider keys are referenced at import time).
- npm is the required package manager (`package-lock.json`, `.npmrc` `legacy-peer-deps=true`).
- AGPL-3.0 licensed.

### Known limitations

- **Credit deduction is client-initiated and estimate-based.** The `continueConversation` server action does not check or deduct credits; deduction happens client-side after generation using a character-count token estimate, so it is neither authoritative nor abuse-resistant **(inferred)**.
- **No Stripe webhook.** Payments are recorded client-side after success; there is no server-side confirmation or idempotency guarantee beyond a client-side duplicate check **(inferred)**.
- **User API keys are stored in plaintext** in the Firestore profile document **(inferred)**.
- **The model set is fixed at five** and hard-coded in `MODEL_CONFIG`; users cannot choose which/how many models to query.
- **No export/share** of comparisons; **no conversation branching**; **no prompt templates**; **no programmatic API**.
- **Token "counting" is an approximation**, so credit charges and any usage display do not reflect real provider token usage.
- `README.md` references a `firebase.json` and a CLI deploy flow, but `firebase.json` is not in the repo **(inferred: rules are deployed manually or out-of-repo)**.

---

## 3. Product roadmap

Roadmap items are ordered by product impact and dependency order. Each is scoped to a single, reviewable, PR-sized change (one clean commit sequence). The focus is product capability, reliability, usability, onboarding/activation, and the core comparison workflow — not generic cleanup. Items are intentionally grounded in the existing app and product promise.

### Milestone 1 — Trustworthy credit charging (reliability)
- **User value**: users (and the operator) can trust that credit balances are accurate and not bypassable; protects the credits business model.
- **Implementation intent**: move credit verification/deduction into the `continueConversation` server action — check sufficient balance via `verifyAuth()`-derived uid + a Firestore transaction before/after streaming, and have the client reflect (not drive) the new balance. Keep API-keys mode free of credit checks.
- **Acceptance criteria**:
  - In credits mode, a request with insufficient credits is rejected server-side before any provider call.
  - Credits are deducted server-side exactly once per completed comparison; the client no longer independently mutates balance for charging.
  - API-keys mode performs no credit deduction.
  - Lint, typecheck, and build pass.

### Milestone 2 — Stripe webhook for verified credit fulfillment (reliability)
- **User value**: purchased credits are granted reliably even if the browser closes mid-flow, and duplicate grants are prevented.
- **Implementation intent**: add a Stripe webhook route handler that verifies the event signature and credits the user on `payment_intent.succeeded`, with idempotency keyed on the payment intent id; keep the existing client path as a fast-path/no-op when the webhook already recorded it.
- **Acceptance criteria**:
  - Successful payments grant credits without relying on the client.
  - Replays/duplicate events do not double-credit.
  - Webhook secret read from env; documented in `.env.example` and `README.md`.
  - Lint, typecheck, and build pass.

### Milestone 3 — Selectable models per comparison (core workflow + activation)
- **User value**: users compare exactly the models they care about, reduce cost/noise, and aren't forced into all five.
- **Implementation intent**: add a model-selection control in the chat UI backed by `MODEL_CONFIG`; persist the selection (profile or local store); fan-out only to selected models. Default to all five for first-time users.
- **Acceptance criteria**:
  - Users can enable/disable individual models; the comparison fans out only to enabled ones.
  - Selection persists across sessions.
  - At least one model must remain selected (guarded in UI).
  - Lint, typecheck, and build pass.

### Milestone 4 — Export & copy a comparison (core workflow)
- **User value**: users can capture and share results — the natural end of a comparison session.
- **Implementation intent**: add per-response "copy" and a per-comparison "export to Markdown" action (prompt + each model's answer). Reuse existing markdown rendering; no server work required.
- **Acceptance criteria**:
  - One-click copy of any single model response.
  - Export produces a Markdown file containing the prompt and all responses with model labels.
  - Works for both live and history-loaded comparisons.
  - Lint, typecheck, and build pass.

### Milestone 5 — Accurate token usage from providers (reliability + transparency)
- **User value**: credit charges and usage display reflect real model usage, not a character estimate, increasing trust.
- **Implementation intent**: capture real token usage from the AI SDK stream result (provider `usage`) in the server action, return it alongside the stream, and use it for credit cost and any usage display, replacing the `utils/token.ts` estimate for charging. (Depends on Milestone 1 owning server-side deduction.)
- **Acceptance criteria**:
  - Credit cost is computed from provider-reported usage when available, with the estimate as a documented fallback.
  - Per-response usage is surfaced in the UI.
  - Lint, typecheck, and build pass.

### Milestone 6 — First-run onboarding & empty states (onboarding/activation)
- **User value**: new users immediately understand the compare-many concept and reach their first comparison faster.
- **Implementation intent**: improve the post-sign-in empty state with example prompts that pre-fill the input and a one-line explanation of credits vs API keys; surface the starting credit balance.
- **Acceptance criteria**:
  - New users see example prompts that populate the input on click.
  - Empty state explains the two usage modes and shows current credit balance.
  - No regression to the existing chat layout; lint, typecheck, and build pass.

### Milestone 7 — Encrypt or scope user-provided API keys (reliability/security of a core feature)
- **User value**: bring-your-own-key users can trust their keys are not stored in readable plaintext.
- **Implementation intent**: stop persisting raw provider keys in the Firestore profile document; encrypt at rest (server-held key) or move key handling so plaintext keys are never written to Firestore. Adjust `resolveApiKey`/Settings accordingly.
- **Acceptance criteria**:
  - Provider API keys are no longer readable as plaintext in Firestore.
  - API-keys mode still works end-to-end for all providers.
  - `.env.example`/docs updated for any new secret; lint, typecheck, and build pass.

### Backlog (smaller, product-aligned follow-ups)
- Add additional providers/models behind `MODEL_CONFIG` (e.g., Cohere) once selectable models (M3) ships.
- Prompt templates / saved prompts library to speed repeat comparisons.
- Conversation branching (fork a comparison to explore a follow-up per model).
- Lightweight programmatic API for submitting a prompt and retrieving multi-model results (depends on server-side credit enforcement from M1).

> Roadmap discipline: do not expand these into large lint/test/refactor backlogs. Introducing a test framework or CI is acceptable only when it directly unlocks one of the items above and is scoped as its own PR-sized change.
