# Prompt.me AI (`promptmeai`)

Send one prompt to three models and compare the answers as they stream. Sign in, pay with platform credits or your own provider keys, keep comparison history, and buy credits with Stripe. Live site: [prompt.me](https://prompt.me/).

## Features

- Three models, defined in `src/constants/modelNames.ts`: GPT-6.1 Sol (`gpt-6.1-sol`, OpenAI), Claude Opus 5.5 (`claude-opus-5-5`, Anthropic), and Gemini 4 Argon (`gemini-4-argon`, Google). Older saved answers still display under their original model name.
- Streaming through the Vercel AI SDK (`streamText` and `@ai-sdk/rsc`) in `src/actions/generateActions.ts`. Each comparison fans out to all three models. Leaving the chat cancels the provider call.
- Credits mode reserves the estimated cost before the provider call and refunds unused credits after the stream. Bring-your-own-key mode loads provider keys on the server. Those keys are encrypted at rest when `API_KEYS_ENCRYPTION_KEY` is set, and that mode fails closed when it is not.
- Auth: Google popup, email/password, and email link (`/loginfinish`). The Firebase ID token is stored in an HttpOnly cookie. Email/password accounts get the starting credits after the address is verified. Account deletion removes chats, profile, and the sign-in; Stripe keeps its own payment records.
- Chat history with pin, search, and delete. Transcripts live on a nested document so the sidebar does not download them.
- Stripe PaymentIntents for a catalog credit purchase (`/payment-attempt`, `/payment-success`). `POST /api/stripe/webhook` grants the same purchase when `STRIPE_WEBHOOK_SECRET` is set. Without that secret the webhook returns 503 and the success page still grants after it reloads the PaymentIntent.
- Light, dark, and system themes, markdown responses, cookie consent, and privacy, terms, and support pages.
- Route gate in `src/proxy.ts` (cookie presence only). Server actions call `verifyAuth()`, which checks the ID token with Firebase Admin.

## Tech stack

Versions are the ranges in `package.json`.

| Area | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router | ^16.4.3 |
| UI | React, NextUI | ^19.3.1, NextUI ^2.6.11 |
| Language | TypeScript | 7.0.2 for `tsc`; Next loads TypeScript 6 (`typescript` package) |
| Styling | Tailwind CSS | ^4.3.3 |
| State | Zustand | ^5.0.16 |
| Auth and data | Firebase client, firebase-admin | ^13.1.0, ^14.5.0 |
| AI | `ai`, OpenAI, Anthropic, Google, `@ai-sdk/rsc` | ai ^7.0.156 |
| Payments | Stripe, React Stripe.js | stripe ^23.0.1 |
| Markdown | react-markdown, remark-gfm, rehype-sanitize, rehype-raw | — |
| Tests | Vitest | ^5.0.5 |

`firebase-admin` 14 uses `jwks-rsa` 4. `package.json` overrides that package to `jose` 5.10.0 so `require("firebase-admin/auth")` does not load the ESM-only `jose` 6 build.

## Project structure

```
src/
  app/                     # /, /chat, /settings, auth, payments, legal
  app/api/auth/logout/     # expires the HttpOnly session cookie
  app/api/stripe/webhook/  # catalog credit grant
  actions/                 # generate, payment, profile, session
  components/ layouts/
  firebase/                # client, admin, credit ledger, paths
  zustand/
  constants/modelNames.ts
  proxy.ts
firestore.rules
storage.rules
firebase.json
.env.example
.github/workflows/ci.yml
.github/workflows/malware-scan.yml
```

## Getting started

### Prerequisites

- Node.js 22, which is what CI uses
- npm
- A Firebase project and a service account for server auth
- Provider API keys if you want platform-credit inference
- A Stripe account if you want credit purchases

### Install

```bash
git clone https://github.com/brown2020/promptmeai.git
cd promptmeai
npm install
```

### Environment variables

Copy `.env.example` to `.env.local`. Never commit real values. Names only are listed here.

#### Public

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_COOKIE_NAME` | Auth cookie name. When unset, the server uses `authToken` (`NEXT_PUBLIC_COOKIE_NAME=authToken`). |
| `NEXT_PUBLIC_FIREBASE_APIKEY` | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTHDOMAIN` | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECTID` | Project id |
| `NEXT_PUBLIC_FIREBASE_STORAGEBUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID` | Messaging sender id |
| `NEXT_PUBLIC_FIREBASE_APPID` | App id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENTID` | Analytics measurement id (optional) |
| `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` | reCAPTCHA v3 site key (optional). Unset skips App Check. |
| `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST` | Auth emulator host for local web client (optional) |
| `NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST` | Firestore emulator host for local web client (optional) |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key |
| `NEXT_PUBLIC_STRIPE_PRODUCT_NAME` | Label stored on PaymentIntents |

#### Server

| Name | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Platform credits for GPT |
| `ANTHROPIC_API_KEY` | Platform credits for Claude |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Platform credits for Gemini |
| `GOOGLE_GENERATIVE_AI_BASE_URL` | Optional Gemini base URL passed into the provider client |
| `API_KEYS_ENCRYPTION_KEY` | 32-byte base64 key. Unset makes bring-your-own-key mode fail closed. |
| `STRIPE_SECRET_KEY` | PaymentIntents. Unset makes checkout and grant actions fail when called. |
| `STRIPE_WEBHOOK_SECRET` | Optional. Unset makes `POST /api/stripe/webhook` return 503. |
| `FIREBASE_TYPE` | Service account type |
| `FIREBASE_PROJECT_ID` | Admin project id |
| `FIREBASE_PRIVATE_KEY_ID` | Key id |
| `FIREBASE_PRIVATE_KEY` | PEM private key, with newlines escaped |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_CLIENT_ID` | Client id |
| `FIREBASE_AUTH_URI` | OAuth auth URI |
| `FIREBASE_TOKEN_URI` | Token URI |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Cert URL |
| `FIREBASE_CLIENT_CERTS_URL` | Client cert URL |
| `FIREBASE_UNIVERSE_DOMAIN` | Present in `.env.example`. `firebaseAdmin.ts` does not read it. |

The Firebase Admin SDK also honors `FIREBASE_AUTH_EMULATOR_HOST` and `FIRESTORE_EMULATOR_HOST` when you run against emulators.

### Firebase and Stripe

1. Enable Google, email/password, and email-link auth. The starting credit balance is granted once the email is verified.
2. Deploy Firestore and Storage rules when those files change. `firebase.json` includes `"rules": "firestore.rules"` and `"rules": "storage.rules"`. Storage writes are limited to 5 MB and to images, PDF, or plain text.
3. Point a Stripe webhook at `/api/stripe/webhook` for `payment_intent.succeeded` and set `STRIPE_WEBHOOK_SECRET` if you want grants when the browser never returns.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Chat is at `/chat` after sign-in.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` (TypeScript 7) |
| `npm test` | Vitest |
| `npm run doctor` | React Doctor |

## Testing and CI

Vitest covers routes and the proxy, server-action inputs, credit reservation and grants, the Stripe webhook, logout cookie expiry, token estimates, and the `jose` pin.

CI on `dev` and `main` (`.github/workflows/ci.yml`) uses Node 22 and runs `npm ci --ignore-scripts`, lint, typecheck, unit tests, React Doctor, and the production build. Public Firebase and Stripe names come from Actions secrets when set. Client init skips when they are missing. `.github/workflows/malware-scan.yml` runs `scripts/malware-scan.sh`.

## Deployment

Production is [prompt.me](https://prompt.me/). Set the env names above on the host. Do not put secret values in the repo. Promote `dev` to `main` only after QA. `main` requires signed commits.

## Contributing

1. Branch from `dev`.
2. Keep `verifyAuth()` first on server actions that read or change account data.
3. Run lint, typecheck, and tests before pushing.
4. Never commit secrets or `.env.local`.

## License

[GNU Affero General Public License v3.0](LICENSE.md) (AGPL-3.0).
