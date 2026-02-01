# CLAUDE.md - Project Guide for AI Assistants

## Project Overview

**Prompt.me AI** is a Next.js web application that allows users to compare responses from multiple AI models side-by-side in real-time. Users send a single prompt to 5 different AI models simultaneously and see streaming responses.

**Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Firebase, Stripe, Zustand

## Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── actions/         # Server Actions (AI generation, Stripe payments)
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components
├── constants/       # App configuration (model names, colors, menu items)
├── firebase/        # Firebase client/admin config and Firestore paths
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts (main 3-panel layout)
├── screens/         # Page-level components with sections/
├── services/        # Business logic (chatService for Firestore CRUD)
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── zustand/         # State management stores
```

## Key Architecture Patterns

### State Management (Zustand)
- `useAuthStore` - Firebase auth user data
- `useProfileStore` - User profile, credits, API keys
- `useChatStore` - Current chat messages and streaming state
- `useChatSideBarStore` - Chat history, active chat, drawer state
- `usePaymentsStore` - Payment history

### Server Actions
- `src/actions/generateActions.ts` - AI model streaming with Vercel AI SDK
- `src/actions/paymentActions.ts` - Stripe payment processing

### Firebase Structure
```
users/{uid}/profile/userData     # User profile, credits, API keys
users/{uid}/payments/{id}        # Payment records
promptme_chats/{uid}/chat/{id}   # Chat messages (JSON serialized)
```

## Supported AI Models

Configured in `src/constants/modelNames.ts`:
- OpenAI (GPT)
- Anthropic (Claude)
- Google (Gemini)
- Mistral
- Fireworks (LLaMA)

## Important Files

- `src/app/providers.tsx` - Global providers (auth, themes, cookies)
- `src/firebase/paths.ts` - Centralized Firestore path builders
- `src/utils/token.ts` - Token counting and credit calculation
- `src/services/chatService.tsx` - Chat CRUD operations

## Code Conventions

- **Path alias**: `@/*` maps to `./src/*`
- **Component organization**: screens/ for pages, components/ for reusable UI
- **Type safety**: Strict TypeScript, types in `src/types/`
- **Styling**: Tailwind CSS utilities, NextUI component library
- **Error handling**: Use `src/utils/logger.ts` for consistent logging

## Environment Variables

Server-side (secrets):
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`
- `MISTRAL_API_KEY`, `FIREWORKS_API_KEY`
- `STRIPE_SECRET_KEY`
- `FIREBASE_ADMIN_*` credentials

Client-side (NEXT_PUBLIC_*):
- Firebase config
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Dual Usage Modes

1. **Credits Mode** (default) - Platform-provided credits
2. **API Keys Mode** - User's own provider API keys

Configured per user in Settings, stored in profile.
