# MISSION: PROACTIVE RESEARCH & INTEGRATION

This is an **ongoing, per-task protocol** — different from `DISCOVER_AI_STACK.md`, which is a one-time/periodic full audit. Run this file's steps every time a non-trivial feature or technical decision comes up during normal work. It is a reusable template: it must contain no hardcoded project name — always resolve `{{PROJECT_NAME}}` from the actual current repository (e.g. its `package.json` name or folder name), never assume a fixed value.

**Reminder of the overall goal (shared with DISCOVER_AI_STACK.md): this protocol exists to make the ONE existing OpenCode agent smarter over time — not to bolt on competing frameworks or spawn parallel agents. Every finding here should sharpen the same agent's judgment, not add a second personality.**

## MANDATORY PROTOCOL

BEFORE suggesting code or creating files for any non-trivial feature:

1. **CONSULT** — Read relevant docs already in `.ai/docs/` and existing skills in `.opencode/skills/` and the global config's `skills/` directory (check both — a relevant skill may already be installed globally from a previous project; resolve the actual global path per the ENVIRONMENT DETECTION step in `DISCOVER_AI_STACK.md` rather than assuming `~/.config/opencode/` — some environments still use `~/.opencode/` directly, and WSL vs native Windows sessions may each have their own).

2. **SEARCH** — Use whichever research MCP is actually available in the current session (verify first — do not assume a specific tool is installed; commonly available: `tavily-search`, `github`). Skip this step gracefully with a note if no search-capable MCP is available, rather than failing silently.
   - Search query pattern: `"Best practice [Technology/Library] [year]"`
   - Search query pattern: `"{{PROJECT_NAME}} architecture patterns"` — only useful if this project has enough public footprint to return anything; for private/unpublished repos, skip this query and rely on local `.ai/docs/` + `ARCHITECTURE.md` instead.
   - Search query pattern: `"OpenCode skills [technology]"` — for discovering relevant skills via skills.sh or agenticskills.io
   - Search query pattern: `"MCP server [technology]"` — for discovering relevant MCP servers
   - Search via CLI: `npx skills find [keyword]` — searches the 970K+ install skills.sh registry
   - **Budget:** 2-5 searches per feature is normal. If you're still searching after 8, stop and proceed with what you have — note the gap rather than searching indefinitely.

3. **INTEGRATE**
   - Find relevant, currently-maintained repos (see RESEARCH SOURCES below).
   - Before adding anything: read the actual `SKILL.md` content, not just the repo description. Reject anything that runs unpinned install scripts or requests unexpected permissions.
   - For any large framework (an orchestration system, not a single skill), **use its own installer** rather than manually copying files — GSD Core, ECC, superpowers, and planning-with-files all explicitly document why manual copying breaks runtime-specific transformations.
   - **Before adding a new orchestration-style framework, check whether one is already installed** (GSD Core / ECC / superpowers are mutually redundant — see the overlap warning in `DISCOVER_AI_STACK.md`). Don't add a second one just because it came up in research for an unrelated feature.
   - New reusable Skills discovered this way follow the same **GLOBAL vs LOCAL** decision used in `DISCOVER_AI_STACK.md`:
     - Genuinely project-agnostic → global skills path (resolved per environment, see above)
     - Tied to this project's specific architecture/conventions → `.opencode/skills/` (this is the single, consistent local skill storage location across both bootstrap files — do not use `.ai/skills/` for installed skills; `.ai/` is for reference docs only).
   - Apply findings to the current implementation.

## RESEARCH SOURCES

Prioritize these when looking for best-practice references (verify each is still active before trusting it — repos get renamed, moved to new owners, or abandoned; the `get-shit-done` → `open-gsd/gsd-core` move is a real example of this happening, don't assume a repo you remember is still at the same location):

**General skill catalogs:**
- `addyosmani/agent-skills` — production-grade engineering skills (TDD, code review, security, API design, performance, frontend-ui), native OpenCode support: https://github.com/addyosmani/agent-skills | Docs: https://skills.addy.ie/
- `sickn33/agentic-awesome-skills` — 1,987+ multi-agent skill catalog, OpenCode-compatible: https://github.com/sickn33/agentic-awesome-skills | Browse: https://sickn33.github.io/agentic-awesome-skills/
- Vercel Skills (skills.sh) — official skills registry, 970K+ installs across 200+ skills: https://www.skills.sh/ | Docs: https://www.skills.sh/docs
- AgenticSkills.io — 181+ curated skills, 200+ MCP servers, 18+ platforms: https://agenticskills.io/
- MCP Servers Agent Skills — 3,000+ skills directory (532 Anthropic, 449 GitHub, 861 Microsoft): https://mcpservers.org/id/agent-skills
- **CLI search:** `npx skills find [keyword]` — searches the skills.sh registry

**Marketing & Growth Skills:**
- `coreyhaines31/marketingskills` — AI-powered marketing skill bundle (CRO, copywriting, SEO, paid ads, analytics, lifecycle email): https://github.com/coreyhaines31/marketingskills | Docs: https://marketing-skills.com/
- Browse on skills.sh: `npx skills find marketing`
- AgenticSkills.io marketing category: https://agenticskills.io/category/marketing

**Orchestration frameworks** (pick at most one as primary — see `DISCOVER_AI_STACK.md` overlap warning before recommending any of these):
- `open-gsd/gsd-core` — spec-driven phase-loop workflow, native OpenCode support: https://github.com/open-gsd/gsd-core
- `affaan-m/ECC` — agent harness with instinct-based learning: https://github.com/affaan-m/ECC
- `obra/superpowers` — agentic skills + dev methodology, native OpenCode plugin: https://github.com/obra/superpowers

**Narrower, non-competing tools** (safe to combine with any orchestration choice, or to use standalone):
- `OthmanAdi/planning-with-files` — Manus-style file-based planning only, native OpenCode support: https://github.com/OthmanAdi/planning-with-files

**Design/UI reference:**
- `VoltAgent/awesome-design-md`: https://github.com/VoltAgent/awesome-design-md (web design tokens — verify relevance to React Native before using; may be web-only)

**Git Automation (1-Command AI Commit):**
When setting up Git workflow for any project, use this pattern via OmniRoute:
```bash
# One-command AI commit (configure once, use daily):
git add -A && git diff --cached | llm -m omniroute/my-kiro-claude "Generate a conventional commit message (type(scope): description)" && git commit -F- && git push
```
- Install `llm` CLI: `pip install llm`
- Configure: `llm keys set openai --url http://localhost:20128/v1 --key sk_omniroute`
- The AI generates commit messages following Conventional Commits spec (feat/fix/chore/docs/refactor/style/test)

Treat this list as a starting point, not the full universe — search broadly if these don't cover the current need.

## OUTPUT

If research changes the approach, start your response with:

`🔍 RESEARCH FINDING: [Summary of new best practice] — Implementing based on [Source Link].`

If research confirms the existing approach is already correct, say so briefly instead of forcing a "finding" — don't manufacture a change just to satisfy this protocol.
