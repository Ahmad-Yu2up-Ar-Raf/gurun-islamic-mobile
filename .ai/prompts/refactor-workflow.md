---
name: refactor-workflow
description: Safe refactoring workflow for Gurun Expo project
---

# Refactor Workflow

1. **Identify scope** — Single file, single feature block, or cross-cutting?

2. **Read all callers** — Before touching a function/component, `grep` every usage

3. **Plan the refactor**:
   - Extract repeated logic into shared utility/helper
   - Split large component (>400 lines) into sub-components
   - Migrate from useState → Zustand for shared state
   - Extract inline styles → Tailwind classes

4. **Execute** — One logical change at a time, then verify

5. **Verify no regressions**:
   - `npx tsc --noEmit`
   - Check all affected imports still resolve
   - Verify the change doesn't break sibling features

6. **Format** — `prettier --write <files>`

7. **Commit** — `refactor: <scope>: <description>`
