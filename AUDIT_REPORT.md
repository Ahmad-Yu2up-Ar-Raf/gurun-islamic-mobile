# AUDIT REPORT: Taste Skills for Gurun

> **Repo:** [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (67K stars, MIT)
> **Website:** [tasteskill.dev](https://www.tasteskill.dev/)
> **Project stack:** React Native 0.86 + Expo SDK 57 + NativeWind v4 + Reanimated 4
> **Developer also builds:** Web (Next.js, landing pages, SaaS)

---

## 1. Skill Classification

### GLOBAL (install to `~/.opencode/skills/` — available in ALL projects)

| # | Skill | Install Name | Why | Conflict Notes |
|---|-------|-------------|-----|----------------|
| 1 | **taste-skill v2** | `design-taste-frontend` | Design THEORY sections are universal: color calibration (Lila Rule, premium-consumer palette ban), typography rules (serif discipline, italic clearance), layout diversification (anti-center bias, section-layout-repetition ban), anti-slop rules, dark mode protocol. These apply to ANY UI project — RN or web. | **Implementation rules are web-only** (Next.js, RSC, Tailwind v4, Motion, GSAP, CSS Grid). Must be explicitly overridden for RN projects by our `nativewind-v4` and `reanimated-4` local skills. |
| 2 | **output-skill** | `full-output-enforcement` | Purely behavioral: bans `// ...`, `// TODO`, truncated output, skeleton-only responses. Framework-agnostic — works for RN, web, any stack. | None. Zero conflicts. |
| 3 | **redesign-skill** | `redesign-existing-projects` | Audit-first approach for existing codebases. Framework-agnostic design audit (typography, color, layout, interactivity, states). Doesn't prescribe specific implementation. | None. The fix priority order is universal. |

### BONUS GLOBAL (optional, recommended)

| # | Skill | Install Name | Why |
|---|-------|-------------|-----|
| 4 | **imagegen-frontend-mobile** | `imagegen-frontend-mobile` | Generates mobile app screen designs (icons, mockups, flows). Produces images, not code — platform-agnostic. Useful for Gurun's UI exploration AND any future mobile project. Install via same repo with `--skill "imagegen-frontend-mobile"`. |

### SKIP (not relevant to this stack)

| Skill | Reason |
|-------|--------|
| `design-taste-frontend-v1` | Superseded by v2. Legacy. |
| `gpt-taste` | GPT/Codex specific prompt structure. Web-only implementation. |
| `image-to-code` | Web code pipeline (image → HTML/CSS). Not applicable to RN. |
| `high-end-visual-design` | Web premium style: CSS box-shadow, web fonts, Motion animations. RN uses Reanimated, not Motion. |
| `minimalist-ui` | Deeply CSS-specific: SF Pro Display, Geist Sans, custom border styles, `#EAEAEA` borders. RN doesn't use CSS the same way. |
| `industrial-brutalist-ui` | Web experimental styling. RN-incompatible. |
| `stitch-design-taste` | Google Stitch-specific export format. Not relevant. |
| `imagegen-frontend-web` | Web-only image generation (heroes, landing pages). |
| `brandkit` | Brand identity boards — niche use case, low priority for this install cycle. |

---

## 2. Compatibility Analysis: `design-taste-frontend` Conflicts

The taste-skill v2 has explicit implementation defaults that CONFLICT with our RN stack:

| Taste-Skill Default | Our Project | Impact |
|--------------------|-------------|--------|
| Next.js + React Server Components | React Native + Expo Router | **Ignore.** RN has no RSC concept. |
| Tailwind v4 (`@tailwindcss/postcss`) | NativeWind v4 (Tailwind v3 compatible) | **Ignore.** Our `nativewind-v4` local skill is authoritative. |
| Motion (`motion/react` — formerly Framer Motion) | Reanimated 4 | **Ignore.** Our `reanimated-4` local skill is authoritative. |
| Phosphor/Hugeicons, discourages `lucide-react` | Uses `lucide-react-native` | **Ignore.** Our icon choice is already set. |
| GSAP for scroll animations | Reanimated worklets | **Ignore.** RN has no DOM/scroll in the web sense. |
| CSS Grid / `max-w-[1400px]` | Flexbox + NativeWind utilities | **Ignore.** Use RN layout primitives. |

**Resolution:** The design THEORY (sections 0, 1, 4.1-4.11, 8, 9) is universal and valuable. The implementation rules (sections 2, 3, 5, 6, 7) are web-only and must be skipped for RN projects. For future web projects, they become applicable.

---

## 3. Existing Local Skill Overlaps

| Existing Local Skill | Taste Skill Overlap | Resolution |
|---------------------|--------------------|------------|
| `nativewind-v4` | taste-skill's Tailwind rules and color tokens | Local wins for RN. Taste-skill theory supplements. |
| `reanimated-4` | taste-skill's Motion/GSAP animation rules | Local wins. Taste-skill's motion theory (spring physics, staggered entry) is useful supplemental knowledge. |
| `expo-router-v4` | No overlap | Independent. |
| `tanstack-query-zustand` | No overlap | Independent. |
| `islamic-app-domain` | No overlap | Independent. |
| `clerk-auth` | No overlap | Independent. |

---

## 4. Execution Plan

```bash
# Step 1: Create global skills directory if needed
mkdir -p ~/.opencode/skills/

# Step 2: Install 3 skills from taste-skill repo
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
npx skills add https://github.com/Leonxlnx/taste-skill --skill "full-output-enforcement"
npx skills add https://github.com/Leonxlnx/taste-skill --skill "redesign-existing-projects"

# Step 3: Move to OpenCode global skills directory
cp -r ~/.agents/skills/design-taste-frontend ~/.opencode/skills/
cp -r ~/.agents/skills/full-output-enforcement ~/.opencode/skills/
cp -r ~/.agents/skills/redesign-existing-projects ~/.opencode/skills/

# Step 4: Verify
ls ~/.opencode/skills/ | grep -E "design-taste|full-output|redesign"
# Each must have SKILL.md:
cat ~/.opencode/skills/design-taste-frontend/SKILL.md | head -3
cat ~/.opencode/skills/full-output-enforcement/SKILL.md | head -3
cat ~/.opencode/skills/redesign-existing-projects/SKILL.md | head -3
```

---

## 5. Usage Notes

- **For RN projects:** invoke `design-taste-frontend` for design THEORY only. The `nativewind-v4` and `reanimated-4` local skills remain authoritative for implementation.
- **For web projects:** `design-taste-frontend` applies fully (Next.js, Tailwind v4, Motion, etc.). This is where the implementation rules become useful.
- **Invocation pattern:** "Use design-taste-frontend for the design direction, then apply nativewind-v4 for RN styling."
- **Redesign-skill** works as-is on both platforms — it audits design quality independent of framework.

---

## 6. Verification

After installation and `cp`:
- [ ] `ls ~/.opencode/skills/` shows 3 new folders
- [ ] Each folder has `SKILL.md` with readable content
- [ ] Existing local skills in `.opencode/skills/` are untouched
- [ ] `full-output-enforcement` will auto-activate on every code generation task
- [ ] `redesign-existing-projects` can be invoked for any redesign or UI improvement task

---

Ready for review and approval.
