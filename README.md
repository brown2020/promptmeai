# Prompt.me AI

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-AGPLv3-blue?style=flat-square)

**Compare AI model responses side-by-side in real-time**

[Demo](#demo) • [Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## Overview

Prompt.me AI is an open-source platform that allows you to send the same prompt to multiple leading AI models simultaneously and compare their responses in real-time. Perfect for researchers, developers, and AI enthusiasts who want to understand the strengths and differences between various AI models.

### Supported AI Models

| Model                 | Provider             | Description                     |
| --------------------- | -------------------- | ------------------------------- |
| **GPT-5.5**           | OpenAI               | Frontier reasoning model        |
| **Claude Sonnet 4.6** | Anthropic            | Advanced reasoning and analysis |
| **Gemini 3.5 Flash**  | Google               | Quick, efficient responses      |
| **Mistral Small 4**   | Mistral AI           | Balanced performance model      |
| **Llama 4 Maverick**  | Meta (via Fireworks) | Open-weight multimodal MoE      |

## Features

- 🤖 **Multi-Model Comparison** — Send prompts to 5 AI models simultaneously
- ⚡ **Real-time Streaming** — See responses as they're generated
- 💾 **Chat History** — Save, pin, and organize your conversations
- 🔑 **Dual Usage Modes** — Use platform credits or your own API keys
- 💳 **Payment Integration** — Purchase credits via Stripe
- 🌙 **Dark Mode** — Full dark/light theme support
- 📱 **Responsive Design** — Works on desktop and mobile
- 🔐 **Secure Authentication** — Firebase Auth with Google sign-in

## Tech Stack

### Frontend

- **[Next.js 16.2.7](https://nextjs.org/)** — React framework with App Router
- **[React 19.2.7](https://react.dev/)** — UI library
- **[TypeScript 6.0.3](https://www.typescriptlang.org/)** — Type safety
- **[Tailwind CSS 4.3.0](https://tailwindcss.com/)** — Utility-first styling
- **[NextUI](https://nextui.org/)** — React component library
- **[Framer Motion](https://www.framer.com/motion/)** — Animations

### AI Integration

- **[Vercel AI SDK](https://sdk.vercel.ai/)** — Unified AI provider interface
- **[@ai-sdk/openai](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)** — OpenAI integration
- **[@ai-sdk/anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic)** — Anthropic integration
- **[@ai-sdk/google](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)** — Google AI integration
- **[@ai-sdk/mistral](https://sdk.vercel.ai/providers/ai-sdk-providers/mistral)** — Mistral integration

### Backend & Data

- **[Firebase](https://firebase.google.com/)** — Authentication & Firestore database
- **[Stripe](https://stripe.com/)** — Payment processing
- **[Zustand](https://zustand-demo.pmnd.rs/)** — State management

### Developer Experience

- **[ESLint](https://eslint.org/)** — Code linting
- **[Vitest](https://vitest.dev/)** — Focused unit tests
- **[date-fns](https://date-fns.org/)** — Date utilities
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** — Markdown rendering

## Quick Start

### Prerequisites

- **Node.js 20.9+** (LTS recommended)
- **npm** (required; `package-lock.json` is the source of truth)
- API keys from AI providers (optional if using credits)
- Firebase project
- Stripe account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/brown2020/promptmeai.git
   cd promptmeai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables))

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### AI Provider Keys (Server-side)

```bash
# Required for credit-based usage
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
MISTRAL_API_KEY=...
FIREWORKS_API_KEY=...
```

### Firebase Configuration

```bash
# Client-side (public)
NEXT_PUBLIC_FIREBASE_APIKEY=...
NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECTID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=...
NEXT_PUBLIC_FIREBASE_APPID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENTID=G-...

# Server-side (Admin SDK)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERTS_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

### Stripe Configuration

```bash
NEXT_PUBLIC_STRIPE_KEY=pk_...
NEXT_PUBLIC_STRIPE_PRODUCT_NAME=PromptMe Credits
STRIPE_SECRET_KEY=sk_...
```

### Application Settings

```bash
NEXT_PUBLIC_COOKIE_NAME=promptme_auth
```

## Project Structure

```
promptmeai/
├── src/
│   ├── actions/           # Server actions (AI generation, payments)
│   ├── app/               # Next.js App Router pages
│   │   ├── chat/          # Main chat interface
│   │   ├── settings/      # User settings & API keys
│   │   ├── payment-*/     # Payment flow pages
│   │   └── ...
│   ├── components/        # Reusable UI components
│   │   ├── buttons/       # Button variants
│   │   ├── modals/        # Modal dialogs
│   │   └── ...
│   ├── constants/         # App constants & model config
│   ├── firebase/          # Firebase client & admin setup
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Page layouts & navigation
│   ├── screens/           # Page-level components
│   │   ├── chat/          # Chat screen with sections
│   │   ├── settings/      # Settings screen
│   │   └── ...
│   ├── services/          # Business logic (chat CRUD)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── zustand/           # State management stores
├── public/                # Static assets
└── ...config files
```

## Usage

### Chat Interface

1. **Sign in** with Google or email/password
2. **Type your prompt** in the chat input
3. **View responses** from all AI models simultaneously
4. **Save conversations** automatically to your history
5. **Pin important chats** for quick access

### Usage Modes

| Mode         | Description                             |
| ------------ | --------------------------------------- |
| **Credits**  | Use platform-provided credits (default) |
| **API Keys** | Use your own API keys for each provider |

Configure your usage mode in **Settings**.

### Purchasing Credits

1. Navigate to **Settings**
2. Click **Buy 10,000 Credits**
3. Complete payment via Stripe
4. Credits are added instantly

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run Vitest unit tests
bash scripts/malware-scan.sh tree   # Run the local malware IOC scan used by CI
```

## Firebase Setup

### Firestore Database Structure

```
users/
  └── {uid}/
      └── profile/
          └── userData          # User profile & settings
      └── payments/             # Payment history
          └── {paymentId}

promptme_chats/
  └── {uid}/
      └── chat/
          └── {chatId}          # Individual chat conversations
```

### Security Rules

This repo includes production-ready rules that ensure **users can only access their own data**:

- **Firestore**: `firestore.rules`
- **Storage**: `storage.rules`

#### What’s protected

- **User data**: `users/{uid}` and `users/{uid}/profile/userData`
- **Payments**: `users/{uid}/payments/{paymentDocId}` (read/create only; update/delete denied by default)
- **Chats**: `promptme_chats/{uid}/chat/{chatId}` (create/update require `userId === uid`)
- **Everything else**: denied by default

#### Deploy (Firebase Console)

- **Firestore**: Firebase Console → Firestore Database → **Rules** → paste from `firestore.rules` → Publish
- **Storage**: Firebase Console → Storage → **Rules** → paste from `storage.rules` → Publish

#### Deploy (Firebase CLI)

If you use the Firebase CLI, ensure your `firebase.json` points to the rule files:

```json
{
  "firestore": { "rules": "firestore.rules" },
  "storage": { "rules": "storage.rules" }
}
```

Then deploy:

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `perf:` — Performance improvements
- `test:` — Test additions or modifications
- `chore:` — Maintenance tasks

### Development Guidelines

- Write TypeScript with proper types
- Follow the existing code style
- Add comments for complex logic
- Keep components small and focused
- Use the existing utility functions

## Roadmap

The product roadmap and full feature spec live in **[spec.md](spec.md)** — the single authoritative product/roadmap document. Agent and engineering operating rules live in **[AGENTS.md](AGENTS.md)**.

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)** — see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- [Vercel](https://vercel.com) for the AI SDK and hosting
- [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Google](https://ai.google), [Mistral](https://mistral.ai), [Meta](https://ai.meta.com) for their AI models
- [Firebase](https://firebase.google.com) for authentication and database
- [Stripe](https://stripe.com) for payment processing

---

<div align="center">

**[⬆ Back to Top](#promptme-ai)**

Made with ❤️ by [Brown2020](https://github.com/brown2020)

</div>
