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
- `@firebase/*` declares `node >= 24.12.0`. CI and local runs are Node 22. `require("firebase-admin/auth")` loads on Node 22. Moving CI to Node 24 is an operator decision, not a package bump in this repo.
- Typecheck (`tsc`) is TypeScript 7. Next's build loads the `typescript` package, which is TypeScript 6, because TypeScript 7's package is ESM and Next still `require`s `typescript`.

## Dependency audit

`npm audit` reports 13 low findings, all `@nextui-org/*` via `deepmerge` `>=4.2.0` (prototype pollution in `mergeObject`). No moderate, high, or critical findings. `npm audit fix` does not clear them: `@nextui-org/theme` and `@nextui-org/react` have no patched release. `@heroui/react` 3 no longer depends on `deepmerge`, but it is a different component API (no drop-in `NextUIProvider`, Modal, or Dropdown). That migration is a UI change, not a safe bump.

## Do not do casually

- Do not change `gpt-6.1-sol`, `claude-opus-5-5`, or `gemini-4-argon` unless a provider retires the id.
- Do not remove the `jwks-rsa` → `jose@5.10.0` override while `firebase-admin` 14 and `jwks-rsa` 4 are installed. `jose` 6 is ESM-only and crashes `require()` inside `jwks-rsa`.
- Do not deploy Firebase rules or change Vercel env from a docs or dependency pass.
