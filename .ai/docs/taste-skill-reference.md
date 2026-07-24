# Taste Skill Reference

**Repo:** https://github.com/Leonxlnx/taste-skill  
**Website:** https://www.tasteskill.dev/  
**Install:** `npx skills add Leonxlnx/taste-skill`  
**Status:** Not yet installed in this environment

## Available Skills (13 total)

### Implementation Skills (code output)

| Skill Name | Install Name | Purpose |
|-----------|-------------|---------|
| taste-skill v2 | `design-taste-frontend` | Anti-slop default: reads brief, infers design language, tunes VARIANCE/MOTION/DENSITY dials |
| taste-skill v1 | `design-taste-frontend-v1` | Legacy v1 preserved |
| gpt-tasteskill | `gpt-taste` | Stricter GPT/Codex variant |
| image-to-code | `image-to-code` | Generate images → analyze → implement code |
| redesign-skill | `redesign-existing-projects` | Audit existing UI first, then redesign |
| soft-skill | `high-end-visual-design` | Calm, expensive UI, premium fonts, spring motion |
| output-skill | `full-output-enforcement` | Forces complete output, no placeholders |
| minimalist-skill | `minimalist-ui` | Editorial product UI (Notion/Linear vibes) |
| brutalist-skill | `industrial-brutalist-ui` | Swiss type, sharp contrast, experimental layout |
| stitch-skill | `stitch-design-taste` | Google Stitch-compatible + DESIGN.md export |

### Image Generation Skills (image output only)

| Skill Name | Install Name | Purpose |
|-----------|-------------|---------|
| imagegen-frontend-web | `imagegen-frontend-web` | Website comps, hero, landing pages |
| imagegen-frontend-mobile | `imagegen-frontend-mobile` | Mobile screens (iOS/Android) |
| brandkit | `brandkit` | Brand identity boards |

## Compatibility
- Framework agnostic (React, Vue, Svelte, React Native)
- Works with OpenCode, Claude Code, Cursor, Codex, Gemini CLI
- For this project (React Native + NativeWind): use `design-taste-frontend` as global skill

## Classification
- **GLOBAL** (`~/.opencode/skills/`): `design-taste-frontend` (applies to all frontend projects)
- **LOCAL** (`.opencode/skills/`): `imagegen-frontend-mobile` (specific to mobile app design)
- **SKIP**: `brutalist-skill`, `minimalist-skill`, `soft-skill` (only install if specific visual direction is chosen)
