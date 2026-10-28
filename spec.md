# Prompt.me AI — product spec

What the app does today. Engineering rules live in [`AGENTS.md`](./AGENTS.md). Next work lives in [`roadmap.md`](./roadmap.md).

## Promise

One prompt goes to three models at once. Their answers stream side by side so a person can compare quality, tone, speed, and correctness without three tabs.

## Who it is for

Researchers comparing models, developers choosing a provider, and people who want one place to ask several models.

## What is built

Prompt.me AI is a Next.js App Router app. Most screens are client components. Server work is a small set of actions and two route handlers. Firebase Auth and Firestore store identity, profiles, and chats. Stripe sells a fixed catalog of credits.

### Comparison

- Models, in `src/constants/modelNames.ts`: GPT-6.1 Sol (`gpt-6.1-sol`), Claude Opus 5.5 (`claude-opus-5-5`), Gemini 4 Argon (`gemini-4-argon`).
- `ChatInput` calls `continueConversation` once per model. Responses stream with `streamText` and `@ai-sdk/rsc`.
- Output is capped at 8,192 tokens. Prompt text sent to a model is capped at 100,000 characters, and that same slice is what credit math uses.
- Stop, or leaving the chat, aborts the provider request.
- Saved replies from older model ids still render, labeled with the name they were stored under.

### Credits and keys

- Settings switches between platform credits and the user's own API keys.
- In credits mode the server reserves `max(1, estimated cost of the bounded input plus the maximum output)` before calling the provider, then refunds the unused part. A settlement failure keeps the hold. An empty reply refunds the whole hold. Any non-empty reply costs at least 1 credit.
- The estimate is about 4 characters per token, times `0.004`, rounded. It is not provider-reported usage.
- A new profile receives 1,000 credits once, and only after Firebase Auth says the email is verified. Profiles that already existed before that marker do not get a second grant.
- A catalog purchase is 9,999 cents and grants 10,000 credits. The grant is stored at `users/{uid}/billing/grants/{paymentIntentId}`. Clients cannot write that tree.
- `POST /api/stripe/webhook` verifies `STRIPE_WEBHOOK_SECRET` and grants the same catalog purchase. If the secret is unset the route returns 503. The success page can still grant after it reloads the PaymentIntent, and the grant document makes that idempotent.
- Bring-your-own keys are AES-256-GCM ciphertext when `API_KEYS_ENCRYPTION_KEY` is a 32-byte base64 key. Otherwise key storage fails closed. Firestore rules reject client writes to `APIKeys`, `credits`, and `totalCredits`, and reject client deletes of the profile.

### Account and history

- Sign-in: Google popup, email/password, email link (`/loginfinish`).
- `establishSession` verifies the ID token and stores it in an HttpOnly cookie. `POST /api/auth/logout` expires that cookie even when the token is already invalid.
- The proxy redirects requests that have no auth cookie away from protected pages. It does not verify the token. `verifyAuth()` does.
- Chats are listed from `promptme_chats/{uid}/chat/{id}` (name, pin, time). The transcript is `.../body/transcript`.
- Delete account removes the user's chats, profile, and Firebase user through the Admin SDK. Stripe's own records stay.

### Other surfaces

- Settings: usage mode, credit balance, API keys, payment history, sign-out, delete account.
- Themes: light, dark, system.
- Legal and support pages are public. So are `/`, auth pages, the Stripe webhook, and logout.
- A React Native webview hides Google sign-in, API-key entry, and credit purchase. `/payment-attempt` sends that webview to Settings.
- App Check starts only when `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` is set. Enforcement is a Firebase console setting, not something this repo turns on.

## Data

Paths are built in `src/firebase/paths.ts`.

- `users/{uid}/profile/userData`
- `users/{uid}/payments/{id}` (history the client may create; not the grant lock)
- `users/{uid}/billing/**` (server only)
- `promptme_chats/{uid}/chat/{id}` and `.../body/transcript`

`firebase.json` points at `firestore.rules` and `storage.rules`. Storage writes must be under 5 MB and an image, PDF, or plain text. Deploying those files is an operator step. This repo does not deploy them.

## Stack

Next.js 16, React 19, TypeScript strict, Tailwind CSS 4, NextUI 2, Zustand 5, Firebase JS 13, firebase-admin 14, Vercel AI SDK 7, Stripe 23, Vitest 5. npm is the package manager (`.npmrc` sets `legacy-peer-deps=true`).

CI is Node 22 and runs lint, typecheck, unit tests, React Doctor, and a production build, plus a separate malware IOC scan.

## Trust boundary

Server actions that change or read private data call `verifyAuth()` before doing work, then parse inputs from `src/actions/inputs.ts`. Logout is a route handler with no arguments because it must clear an already-invalid cookie, and it only expires the cookie on that request. Firestore and Storage rules are the data boundary. The Admin SDK bypasses those rules, which is how credits, grants, and account deletion are written.
