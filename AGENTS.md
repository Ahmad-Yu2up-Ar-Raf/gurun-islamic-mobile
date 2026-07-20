# Gurun — Agent Guide

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | `expo start -c` (always clears Metro cache) |
| `npm run android` | `expo start -c --android` |
| `npm run ios` | `expo start -c --ios` |
| `npm run web` | `expo start -c --web` |
| `npm run clean` | Wipes `.expo` and `node_modules` |
| `npx tsc --noEmit` | TypeScript check (no dedicated script) |
| `prettier --write <file>` | Format (uses `prettier-plugin-tailwindcss`) |

No lint, test, or typecheck scripts in `package.json`. Run these manually before committing.

## Architecture

- **Routing**: Expo Router v4 (file-based). Root `Stack` → `(drawer)` → `(tabs)` (Home / Quran / Qibla / Settings) + standalone drawer screens (Doa, Dzikir, Hadist, Asmaul Husna) + `surah/[id]` detail.
- **Feature blocks** live in `components/ui/core/block/<feature>/`, each with local `hooks/`, `store/`, `services/`, `types/`, `utils/`. Import via `@/` alias (maps to project root).
- **State**: TanStack Query v5 for server data; Zustand (with persist) for client state. Feature-scoped stores beside their block.
- **API client**: Ky instance at `api/client.ts`, base URL from `EXPO_PUBLIC_API_URL` (`.env`). Defaults to `https://equran.id/api/`.
- **Auth**: Clerk (`@clerk/clerk-expo`) via OAuth/email + SecureStore for tokens.
- **Styling**: NativeWind v4 + TailwindCSS v3. HSL theme variables in `global.css`. Dark mode via `.dark` class on root.
- **Fonts**: Poppins (4 weights), Teko (5 weights), Schluber (custom), Noto Naskh Arabic — loaded in `app/_layout.tsx` via `useFonts`.
- **Animation**: Reanimated 4 with worklets on UI thread. Reanimated logger configured `strict: false`.
- **Components**: 21 shadcn/ui-inspired primitives at `components/ui/fragments/shadcn-ui/`. Config in `components.json`.

## Bootstrap flow

`app/_layout.tsx` → `useBootstrap()`:
1. Load custom fonts
2. Hydrate location Zustand store (province/city from persisted storage or device GPS)
3. Once ready, pre-fetch prayer schedule via TanStack Query
4. Hide splash screen

## Developer conventions (enforced)

- **Immutability**: never mutate objects/arrays — spread or return new references.
- **No hardcoded secrets** — all configurable values from `.env` or constants.
- **Error handling**: every async operation wrapped in try/catch with user-friendly messages.
- **File size**: <800 lines per file, <50 lines per function.
- **Prettier**: `printWidth: 100`, `singleQuote: true`, `bracketSameLine: true`, `trailingComma: 'es5'`.

## Relevant instruction files

- `.opencode/.opencode.json` — ignore list and general instructions (Bahasa Indonesia)
- `.opencode/skills/ecc-brain/SKILL.md` — full code style, security, TDD, git workflow rules

## Core Thinking Layers — Global Skills (3-Layer Stack)

### Layer 1: ECC (Foundation OS) — `~/.config/opencode/skills/ecc/*/`
Instinct-driven development: TDD, security, coding standards, verification loops, eval harness, strategic compact. Auto-prompt on relevant tasks.

| Skill | Use When |
|-------|----------|
| tdd-workflow | Writing new features or bug fixes — enforce RED-GREEN-REFACTOR |
| security-review | Handling user input, auth, API endpoints, sensitive data |
| coding-standards | Writing any production code |
| verification-loop | After completing a feature — verify against criteria |
| eval-harness | Measuring model output quality |
| strategic-compact | Starting a large feature — align on scope before coding |

### Layer 2: Superpowers (SDLC Methodology) — via `superpowers@git+https://github.com/obra/superpowers.git` plugin
Full software development workflow: brainstorm → design → plan → execute → review.
Installed as global plugin. Activate via: `use skill tool to load [skillname]`

| Skill | Phase |
|-------|-------|
| brainstorming | Requirements discovery, design exploration |
| writing-plans | Create detailed implementation plans |
| executing-plans | Batch execution with human checkpoints |
| subagent-driven-development | Parallel subagent task dispatch |
| test-driven-development | Enforce RED-GREEN-REFACTOR cycle |
| systematic-debugging | 4-phase root cause analysis |
| requesting-code-review | Pre-commit review checklist |
| using-git-worktrees | Parallel dev branches |
| finishing-a-development-branch | Merge/PR workflow |

### Layer 3: planning-with-files (Manus-Style Persistent Planning)
Crash-proof markdown plans that survive `/clear` and context loss.

| File | Purpose |
|------|---------|
| `task_plan.md` | Phases, progress, decisions — create BEFORE any complex task |
| `findings.md` | Research, discoveries, architecture decisions |
| `progress.md` | Session log, test results — update after each action |

**Mandatory:** read planning files before decisions, update after each phase.
**3-Strike Error Protocol:** 3 failures → escalate to user.
**Session Recovery:** After `/clear`, check `session-catchup.py` output.

### Layer 4: Open GSD — Spec-Driven Shipping Workflow

Installed at `~/.config/opencode/`. 65+ `/gsd-*` slash commands, 71 skills, and subagents for the full Research → Plan → Execute → Verify → Ship pipeline.

| Command | Phase |
|---------|-------|
| `/gsd-new-project` | Greenfield project setup |
| `/gsd-discuss-phase N` | Requirements discussion & scoping |
| `/gsd-plan-phase N` | Research + plan + verify |
| `/gsd-execute-phase N` | Parallel execution via subagents |
| `/gsd-verify-work N` | Manual UAT & verification |
| `/gsd-ship N` | Create PR from verified work |
| `/gsd-progress` | Session status & next step |
| `/gsd-quick` | Ad-hoc task with optional research |
| `/gsd-code-review` | Code quality review gate |

**Use when:** shipping production features, managing milestones, or needing a structured workflow loop. Works alongside Superpowers — let GSD manage the phase pipeline, use Superpowers skills for individual steps.

## Claude-Mem — Cross-Session Memory

Worker running at `http://127.0.0.1:37700`. Memory context auto-injects into `~/.config/opencode/AGENTS.md`. Captures sessions for recall across restarts.

**Use when:** resuming work after a `/clear` or new session, recalling past decisions, or referencing earlier sessions.

## Combined Tool Flow

```
1. Claude-Mem    → Recovers context from past sessions
2. Graphify      → Maps codebase relationships
3. GitNexus      → Impact analysis before edits
4. Open GSD      → Phase pipeline (discuss → plan → execute → verify → ship)
5. Superpowers   → Individual phase skills (brainstorm, debug, review)
6. ECC           → Foundation OS (TDD, security, standards)
7. Planning-with-files → Persistent task plan on disk
```

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Gurun** (953 symbols, 1525 relationships, 29 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Gurun/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Gurun/clusters` | All functional areas |
| `gitnexus://repo/Gurun/processes` | All execution flows |
| `gitnexus://repo/Gurun/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.opencode/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.opencode/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.opencode/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.opencode/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.opencode/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.opencode/skills/gitnexus-cli/SKILL.md` |
| Work in the Shadcn-ui area (56 symbols) | `.opencode/skills/generated/shadcn-ui/SKILL.md` |
| Work in the Hooks area (28 symbols) | `.opencode/skills/generated/hooks/SKILL.md` |
| Work in the Custom-ui area (7 symbols) | `.opencode/skills/generated/custom-ui/SKILL.md` |
| Work in the App area (5 symbols) | `.opencode/skills/generated/app/SKILL.md` |
| Work in the Services area (5 symbols) | `.opencode/skills/generated/services/SKILL.md` |
| Work in the Cluster_18 area (4 symbols) | `.opencode/skills/generated/cluster-18/SKILL.md` |
| Work in the Doa area (3 symbols) | `.opencode/skills/generated/doa/SKILL.md` |
| Work in the Hadist area (3 symbols) | `.opencode/skills/generated/hadist/SKILL.md` |
| Work in the Asmaul_husna area (3 symbols) | `.opencode/skills/generated/asmaul-husna/SKILL.md` |
| Work in the Server area (3 symbols) | `.opencode/skills/generated/server/SKILL.md` |

## Graphify — Knowledge Graph

This project has a graphify knowledge graph at `graphify-out/`. Before answering architecture or codebase questions, check it:
- `/graphify query "question"` — scoped subgraph for a plain-language question
- `/graphify path "A" "B"` — shortest path between two symbols
- `/graphify explain "X"` — plain-language explanation of a node and its neighbors

Run `graphify extract . --update` after significant changes to keep the graph current.

<!-- gitnexus:end -->
