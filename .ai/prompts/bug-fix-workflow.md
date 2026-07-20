---
name: bug-fix-workflow
description: Bug reproduction and fix workflow for Gurun Expo project
---

# Bug Fix Workflow

1. **Reproduce** — Trace the reported symptom to the actual component/block

2. **Root cause** — Identify:
   - Is it a state issue? (wrong selector, stale data, missing hydration)
   - Is it a rendering issue? (re-render loop, wrong key, missing memo)
   - Is it a data issue? (wrong API response, stale cache, missing error handling)
   - Is it a platform issue? (iOS vs Android behavior, safe area, gesture conflict)

3. **Fix** — Smallest possible change that addresses the root cause:
   - Shared function bug → fix at the shared function, not every caller
   - Component rendering → fix the component
   - Data stale → increase/fix staleTime, add refetch trigger

4. **Verify** — Check the fix doesn't break sibling features (same store? same query key?)

5. **Format & Typecheck** — `prettier --write <files>` + `npx tsc --noEmit`

6. **Commit** — `fix: <component>: <description>`
