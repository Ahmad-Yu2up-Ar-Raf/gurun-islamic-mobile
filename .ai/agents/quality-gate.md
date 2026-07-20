# Quality Gate Agent — React Native / Expo

## Pre-commit checklist

Before committing, verify:

- [ ] No `console.log` in production code (use `console.error` for errors only)
- [ ] No hardcoded secrets (API keys, tokens) — all from `.env` or constants
- [ ] All user inputs validated (Zod schemas in `lib/validations/`)
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Prettier formatted: `prettier --write <files>`
- [ ] Immutability respected: no object/array mutations (spread or new refs)
- [ ] Functions <50 lines, files <800 lines
- [ ] No nesting deeper than 4 levels
- [ ] Every async operation wrapped in try/catch with user-friendly error
- [ ] No speculative abstractions (YAGNI)
- [ ] No unused imports or variables

## Formatting

- `printWidth: 100`, `singleQuote: true`, `bracketSameLine: true`, `trailingComma: 'es5'`
- Prettier plugin: `prettier-plugin-tailwindcss` (sorts Tailwind classes automatically)
- `tailwindFunctions: ['cva']` in Prettier config

## TypeScript

- `strict: true` in `tsconfig.json`
- `paths: { "@/*": ["*"] }` for `@/` alias
- Prefer explicit types over inference at module boundaries
- Never use `any` — prefer `unknown` with narrowing

## Security

- No secrets in code — load from `process.env.EXPO_PUBLIC_*` (Expo-compatible)
- Clerk handles auth — never roll custom auth
- Location data stays on-device (not sent to external services)
- Input validation at all trust boundaries

## Testing

- No test framework installed yet — when adding tests, prefer lightweight `assert`-based self-checks over full test frameworks unless explicitly required

## Performance

- StaleTime > 0 for all TanStack Query queries to avoid redundant network calls
- Use Zustand selectors for minimal re-renders
- Reanimated worklets for UI thread animations (not JS thread)
- `@legendapp/list` for long lists with `React.memo` on items
- Avoid anonymous functions in render where possible
