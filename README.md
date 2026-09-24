# Prompt.me AI (`promptmeai`)

Send one prompt to multiple leading AI models and compare streaming answers side by side. Sign in, use platform credits or your own provider keys, save comparison history, and top up via Stripe. Live site: [prompt.me](https://prompt.me/).

## Features

Verified from the current codebase:

- Parallel multi-model chat against four configured models (`src/constants/modelNames.ts`): GPT-5.5 (OpenAI), Claude Sonnet 4.6 (Anthropic), Gemini 3.5 Flash (Google), Mistral Small 4 (`mistral-small-latest`)
- Streaming via Vercel AI SDK (`streamText` + `@ai-sdk/rsc`) in `src/actions/generateActions.ts`
- Usage modes: platform **credits** (server provider keys + credit ledger) or **bring-your-own API keys** (stored on profile / settings)
- Auth: Google popup, email/password, email link (`/loginfinish`); password reset; account deletion
- Chat history with pin/search/delete; Zustand stores for auth, profile, credits, chat, payments, etc.
- Stripe PaymentIntents for credit purchases (`/payment-attempt`, `/payment-success`, `/settings`)
- Themes (next-themes), markdown responses, cookie consent, privacy/terms/support pages
- Route gate in `src/proxy.ts` (cookie presence); authoritative checks via Firebase Admin `verifyAuth` + Firestore rules

## Tech stack

| Area | Choice | Version (package.json) |
| --- | --- | --- |
| Framework | Next.js (App Router) | ^16.2.7 |
| UI | React + NextUI | ^19.2.7 / NextUI 2.x |
| Language | TypeScript | ^6.0.3 |
| Styling | Tailwind CSS + typography plugin | ^4.3.0 |
| State | Zustand | ^5.0.14 |
| Auth / data | Firebase client + firebase-admin | ^12.14.0 / ^13.10.0 |
| AI | `ai` + OpenAI / Anthropic / Google / Mistral + `@ai-sdk/rsc` | ai ^6.0.197 |
| Payments | Stripe + React Stripe.js | stripe ^22.2.0 |
| Markdown | react-markdown + remark-gfm + rehype sanitize/raw | — |
| Tests | Vitest | ^4.1.8 |

## Project structure

```
src/
  app/
    page.tsx, chat/, settings/
    login/, signup/, forgot-password/, loginfinish/
    payment-attempt/, payment-success/
    privacy/, terms/, support/
  actions/                 # generateActions, paymentActions, profileActions
  components/ layouts/
  firebase/                # client, admin, creditLedger, paths
  zustand/                 # auth, profile, credits, chat, payments, …
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

- Node.js 22 (matches CI) or a current LTS
- npm
- Firebase project + service account
- Provider API keys for credits mode
- Stripe account for purchases

### Clone and install

```bash
git clone https://github.com/brown2020/promptmeai.git
cd promptmeai
npm install
```

### Environment variables

Copy `.env.example` → `.env.local`. **Never commit real values.**

#### Public / client

| Name | Purpose | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_COOKIE_NAME` | Auth cookie name for proxy + client | Choose a non-secret name |
| `NEXT_PUBLIC_FIREBASE_APIKEY` | Firebase web API key | Firebase Console → Your apps |
| `NEXT_PUBLIC_FIREBASE_AUTHDOMAIN` | Auth domain | Same |
| `NEXT_PUBLIC_FIREBASE_PROJECTID` | Project id | Same |
| `NEXT_PUBLIC_FIREBASE_STORAGEBUCKET` | Storage bucket | Same |
| `NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID` | Messaging sender id | Same |
| `NEXT_PUBLIC_FIREBASE_APPID` | App id | Same |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENTID` | Analytics measurement id (optional) | Same |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe publishable key | Stripe Dashboard → API keys |
| `NEXT_PUBLIC_STRIPE_PRODUCT_NAME` | Product label on PaymentIntents | Your naming |

#### Server secrets

| Name | Purpose | Where to get it |
| --- | --- | --- |
| `OPENAI_API_KEY` | Platform credits → GPT models | OpenAI |
| `ANTHROPIC_API_KEY` | Platform credits → Claude | Anthropic |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Platform credits → Gemini | Google AI Studio |
| `MISTRAL_API_KEY` | Platform credits → Mistral | Mistral |
| `STRIPE_SECRET_KEY` | PaymentIntents | Stripe Dashboard |
| `FIREBASE_TYPE` | Service account type | Service account JSON |
| `FIREBASE_PROJECT_ID` | Admin project id | Same |
| `FIREBASE_PRIVATE_KEY_ID` | Key id | Same |
| `FIREBASE_PRIVATE_KEY` | PEM key (`\n` escaped) | Same |
| `FIREBASE_CLIENT_EMAIL` | Service account email | Same |
| `FIREBASE_CLIENT_ID` | Client id | Same |
| `FIREBASE_AUTH_URI` | OAuth auth URI | Same |
| `FIREBASE_TOKEN_URI` | Token URI | Same |
| `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` | Cert URL | Same |
| `FIREBASE_CLIENT_CERTS_URL` | Client cert URL | Same |

`FIREBASE_UNIVERSE_DOMAIN` is listed in `.env.example` but is not read by `firebaseAdmin.ts` today.

### Firebase / Stripe setup

1. Enable Google, Email/Password, and Email link auth as needed.
2. Deploy `firestore.rules` and `storage.rules` (`firebase.json` / `.firebaserc`).
3. Configure Stripe keys and catalog purchase amount validation (`src/utils/paymentAmount.ts` / credit ledger).

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Chat UI lives at `/chat` after sign-in.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |
| `npm run doctor` | `react-doctor` |

## Testing and CI

- Vitest covers proxy/routes, payment amount helpers, token/text/object utilities, and related modules.
- CI: `npm ci --ignore-scripts`, lint, typecheck, test, doctor, build (Node 22). Public Firebase/Stripe env for build come from Actions secrets when set; client init soft-skips when missing.
- `malware-scan.yml` runs static IOC matching via `scripts/malware-scan.sh`.

## Deployment

Production: [prompt.me](https://prompt.me/). Set all required env vars on the host. Keep Firestore rules in sync so clients cannot mutate frozen credit fields.

## Contributing

1. Branch from `dev`.
2. Keep `verifyAuth` + credit ledger checks on generative and payment actions.
3. Run lint, typecheck, and tests before opening a PR.
4. Never commit secrets or `.env.local`.

## License

[GNU Affero General Public License v3.0](LICENSE.md) (AGPL-3.0).
