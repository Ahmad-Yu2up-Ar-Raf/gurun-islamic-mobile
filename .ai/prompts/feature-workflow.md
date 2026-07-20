---
name: feature-workflow
description: Standard feature development workflow for Gurun Expo project
---

# Feature Development Workflow

1. **Understand the requirement** — Read the task description and identify which feature block(s) to modify

2. **Review architecture docs** — Read `ARCHITECTURE.md`, relevant `.ai/agents/`, and skill files for the stack

3. **Plan the implementation** — Identify:
   - New files needed (if any)
   - Existing files to modify
   - State changes (Zustand store? TanStack Query key?)
   - New API calls (Ky + services file?)
   - UI components (shadcn or custom?)

4. **Implement** — Order of operations:
   a. Types first (`types/` or `type/`)
   b. Server functions (`services/` or `lib/server/`)
   c. Store (Zustand) or query hooks (TanStack Query)
   d. Components (fragments → block)
   e. Wire into route (`app/`)

5. **Review against quality gate** — `quality-gate.md` checks

6. **Format** — `prettier --write <files>`

7. **Typecheck** — `npx tsc --noEmit`

8. **Commit** — Commit with conventional commit message
