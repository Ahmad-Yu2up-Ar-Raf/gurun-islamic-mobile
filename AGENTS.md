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

## Research Protocol (MANDATORY)

Before implementing any non-trivial feature, follow `DEEP_RESEARCH_PROTOCOL.md` in `.ai/bootstrap/`:
1. **CONSULT** — Read existing `.ai/docs/` and skills
2. **SEARCH** — Search for current best practices (budget: 2-5 searches)
3. **INTEGRATE** — Apply findings; use official installers for frameworks

## SKILL DISCOVERY & INVOCATION (CRITICAL)

Do NOT attempt to use built-in `skill` tool to load workflows without reading the SKILL.md first.

**Steps to load a skill:**
1. Analyze the request and determine the correct phase/skill
2. Read the file at `.opencode/skills/<skill-name>/SKILL.md` using the Read tool
3. Completely absorb and apply the instructions
4. Do not write code until planning steps defined in the skill are complete

### Intent → Skill Mapping

| User Intent | Skill to Load |
|-------------|---------------|
| New feature / functionality | `expo-router-v4` + superpowers brainstorming |
| Planning / breakdown | superpowers `writing-plans` |
| Bug / failure | superpowers `systematic-debugging` |
| Code review | superpowers `requesting-code-review` |
| State management | `tanstack-query-zustand` |
| UI / styling | `nativewind-v4` |
| Animations / gestures | `reanimated-4` |
| Prayer / Quran / Qibla feature | `islamic-app-domain` |
| Navigation / routing | `expo-router-v4` |
| Auth (Clerk) | `clerk-auth` |

### Lifecycle Mapping

OpenCode does not support slash commands. Follow this lifecycle internally:

| Phase | Skill |
|-------|-------|
| DEFINE | superpowers `brainstorming` |
| PLAN | superpowers `writing-plans` + `planning-with-files` |
| BUILD | Local skills + ponytail |
| VERIFY | superpowers `systematic-debugging` |
| REVIEW | superpowers `requesting-code-review` |
| SHIP | superpowers `finishing-a-development-branch` |

### Anti-Rationalization

The following thoughts are incorrect and must be ignored:
- "This is too small for a skill"
- "I can just quickly implement this"
- "I'll gather context first"

Correct behavior: always check for and use skills first.

This ensures OpenCode behaves with full workflow enforcement — no shortcuts, no skipped phases.

### Core Rules

- If a task matches a skill, you MUST invoke it
- Skills are located in `.opencode/skills/<skill-name>/SKILL.md` or loaded via superpowers
- Never implement directly if a skill applies
- Always follow the skill instructions exactly — do not partially apply them
- Do not guess the contents of a skill. Always read the file first.

### Execution Model

For every request:

1. **Check** — Determine if any skill applies (even 1% chance)
2. **Invoke** — Load the appropriate skill using the `skill` tool
3. **Follow** — Follow the skill workflow strictly (all steps, all checks)
4. **Proceed** — Only proceed to implementation after required steps (spec, plan, design, review) are complete

## Orchestration: Skills, Tools, and Workflows

This project has three composable layers. They have different jobs:

- **Local Skills** (`.opencode/skills/<name>/SKILL.md`) — domain-specific workflows with patterns and conventions. The *how* for this codebase. Examples: expo-router-v4, nativewind-v4, islamic-app-domain.
- **Global Plugins** (superpowers, ponytail, planning-with-files) — SDLC methodology, code efficiency, and persistent planning. The *discipline* layer that enforces process across ALL projects.
- **Research Protocols** (`.ai/bootstrap/` files) — entry points for deep-dive research and stack audits. The *discover* layer for finding new tools and best practices.

Composition rule: **the user is the orchestrator.** Start with planning-with-files for task tracking, use local skills for domain patterns, invoke superpowers for SDLC phases, and let ponytail enforce minimal code. When unsure, consult research protocols.

## Creating a New Local Skill

### Directory Structure
```
.opencode/skills/
  {skill-name}/           # kebab-case directory name
    SKILL.md              # Required: skill definition
    examples/             # Optional: example files
```

### SKILL.md Format
```markdown
---
name: {skill-name}
description: One sentence describing when to use this skill
---

# {Skill Title}

Brief description of what the skill covers.

## Key Patterns

{Numbered list or tables explaining the patterns}

## When to Use

{Trigger phrases and scenarios}

## Common Pitfalls

{What to avoid}

## Examples

{Code examples}
```

### Naming Conventions
- **Skill directory**: `kebab-case` (e.g., `expo-router-v4`)
- **SKILL.md**: Always uppercase, always this exact filename
- **Examples**: Place in `examples/` subdirectory

### Best Practices for Context Efficiency
- **Keep SKILL.md under 200 lines** — detailed reference material can go in separate files
- **Write specific descriptions** — helps the agent know exactly when to activate the skill
- **Use progressive disclosure** — reference supporting files that get read only when needed
- **Prefer concise examples over verbose explanations** — code examples are more token-efficient than prose

## Global Tooling Stack

### Superpowers (SDLC Methodology — primary orchestration)
Installed as global plugin from `obra/superpowers`. Full SDLC workflow: brainstorm → design → plan → execute → review.
Activate via: `use skill tool to load [skillname]`

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

### Ponytail (Code efficiency mode)
Installed from `@dietrichgebert/ponytail`. YAGNI-first, minimal code, no over-engineering.
Levels: `ponytail lite|full|ultra`. Active by default in `full` mode.

### Planning-with-files (Persistent planning)
Installed from `OthmanAdi/planning-with-files`. Crash-proof markdown plans that survive `/clear`:

| File | Purpose |
|------|---------|
| `task_plan.md` | Phases, progress, decisions — create BEFORE any complex task |
| `findings.md` | Research, discoveries, architecture decisions |
| `progress.md` | Session log, test results — update after each action |

**Mandatory:** Read planning files before decisions, update after each phase.

### Skills Ecosystem References
Discover and install skills from these catalogs:

| Source | URL | Install Command |
|--------|-----|-----------------|
| Skills.sh (Vercel) | https://www.skills.sh/ | `npx skills add owner/repo` |
| Addy Osmani Agent Skills | https://skills.addy.ie/ | `npx skills add addyosmani/agent-skills` |
| AgenticSkills.io | https://agenticskills.io/ | Browse 181+ curated skills |
| Awesome Agent Skills | https://sickn33.github.io/agentic-awesome-skills/ | 1,987+ AAS Core catalog |
| MCP Servers Skills | https://mcpservers.org/id/agent-skills | 3,000+ skills directory |
| Marketing Skills | https://marketing-skills.com/ | `npx skills add coreyhaines31/marketingskills` |

**Search for skills:** `npx skills find [keyword]` — searches the skills.sh registry.

## Local Project Skills (`.opencode/skills/`)

| Skill | Use When |
|-------|----------|
| `expo-router-v4` | Adding screens, navigation groups, deep links, auth guards |
| `nativewind-v4` | Styling with HSL theme, dark mode, fonts |
| `islamic-app-domain` | Prayer times, Quran, Qibla, Arabic typography, adhan lib |
| `tanstack-query-zustand` | State management — server vs client split |
| `reanimated-4` | Animations, worklets, gesture handlers, carousel, compass |
| `clerk-auth` | Auth setup, OAuth flows, protected routes, token management |

## Combined Tool Flow

```
1. Planning-with-files → Load/create task plan on disk
2. Local skills        → Domain-specific patterns (routing, styling, state, animation)
3. Superpowers         → SDLC workflow (brainstorm → plan → TDD → review)
4. Ponytail            → Enforce minimal code, prevent over-engineering
5. Skills.sh/other     → Discover & install new capabilities on demand
```

## 1-Command Git Auto-Commit

The `ai-commit` command is installed at `~/.local/bin/ai-commit` and ready to use:

```bash
ai-commit          # Stage all → AI-generate commit message → commit → push
ai-commit -p       # Skip push
ai-commit -m       # Write commit message manually instead of AI
```

**How it works:** Uses curl to call the local OmniRoute API (`localhost:20128/v1`) to generate a Conventional Commits message from `git diff --cached`. No pip/llm CLI needed — it's a standalone bash script.

## Relevant instruction files

- `.ai/bootstrap/DISCOVER_AI_STACK.md` — AI stack audit and upgrade protocol
- `.ai/bootstrap/DEEP_RESEARCH_PROTOCOL.md` — Per-task research protocol (MANDATORY)
- `.ai/CLEANUP_FAILED_TOOLS.md` — One-time cleanup of failed tools
- `.ai/TEST_GURUN_RESCUE.md` — Git rescue for this project
