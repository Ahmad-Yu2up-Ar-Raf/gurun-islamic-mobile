# AUDIT REPORT: Skill Activation Plan

> **Source:** `~/.agents/skills/` (441 skills installed by `npx skills add -g`)
> **Target:** `~/.opencode/skills/` (currently empty) — GLOBAL skills
> **Active local:** `.opencode/skills/` (6 skills: expo-router-v4, nativewind-v4, reanimated-4, tanstack-query-zustand, islamic-app-domain, clerk-auth)
> **Date:** 2026-07-22

---

## 1. Current State

| Location | Count | Status |
|----------|-------|--------|
| `~/.agents/skills/` | 441 | Installed by npx skills, OpenCode discovers from here |
| `~/.opencode/skills/` | 0 | Empty — needs activation |
| `.opencode/skills/` (project) | 6 | Already active, project-specific |
| OpenCode system prompt | 441 | All skills listed as available_skills |

**Key insight:** OpenCode already discovers `~/.agents/skills/` — skills there ARE loadable via the `skill` tool. The 441 skills in the system prompt's `available_skills` list come from this directory. However, copying the most relevant subset to `~/.opencode/skills/` makes them explicitly "activated" and gives you curation control.

---

## 2. Classification Key

| Tag | Meaning | Target |
|-----|---------|--------|
| **GLOBAL** | Useful for ANY TypeScript/React/Expo project | `~/.opencode/skills/` |
| **LOCAL** | References this project's specific architecture | `.opencode/skills/` |
| **SKIP** | Wrong stack (Python/Go/Rust/Vue/Cloud/Data) or overly niche | Leave at `~/.agents/skills/` |
| **KEEP BOTH** | Official global skill + custom local skill coexist (local overrides) | Both locations |

---

## 3. Recommendations

### 3a. GLOBAL Skills to Activate (104 skills → `~/.opencode/skills/`)

#### Expo & EAS (23) — Official Expo team, actively maintained

| Skill | Why | Lines |
|-------|-----|-------|
| `expo-app-clip` | iOS App Clip setup | ~100 |
| `expo-brownfield` | Native app integration | ~200 |
| `expo-data-fetching` | Network/API/caching patterns for Expo | 449 |
| `expo-dev-client` | Custom dev builds with EAS | ~120 |
| `expo-dom` | Web code in native webviews | ~150 |
| `expo-examples` | 70+ integration examples reference | ~80 |
| `expo-migrate-module` | Native module v1→v2 migration | ~100 |
| `expo-module` | Custom native modules with Expo API | ~300 |
| `expo-native-ui` | Native-feeling UI with Apple HIG | 181 |
| `expo-project-structure` | Folder layout for Expo projects | ~60 |
| `expo-router` | File-based routing (official) | ~200 |
| `expo-tailwind-setup` | Tailwind CSS v4 in Expo | ~150 |
| `expo-ui` | @expo/ui SwiftUI/Compose components | ~200 |
| `expo-upgrade` | SDK version upgrade guidance | ~100 |
| `expo-web-to-native` | Migrate web React apps to native | ~200 |
| `eas-app-stores` | EAS Build → App Store/Play Store | ~200 |
| `eas-hosting` | EAS Hosting for web/API routes | ~180 |
| `eas-observe` | Performance metrics via EAS Observe | ~150 |
| `eas-simulator` | Cloud iOS/Android simulator | ~150 |
| `eas-update-insights` | OTA update health metrics | ~100 |
| `eas-workflows` | EAS CI/CD workflow YAML | ~200 |
| `expo-skill-eval` | Eval Expo skills end-to-end | ~120 |
| `expo-skill-feedback` | Submit feedback on Expo skills | ~80 |

#### React Native (7) — Core RN patterns

| Skill | Why | Lines |
|-------|-----|-------|
| `react-native-best-practices` | RN perf: FPS, TTI, bundle, Hermes | 241 |
| `react-native-architecture` | RN app architecture patterns | ~200 |
| `react-native-design` | RN styling, navigation, animations | ~200 |
| `react-native-expo` | Expo SDK config, EAS, CNG | ~200 |
| `react-native-reusables` | shadcn-style RN components with RN Primitives | 40 |
| `react-navigation` | Stack/Tab/Drawer patterns (RN v7) | ~150 |
| `upgrading-react-native` | RN version upgrade guidance | ~150 |

#### Software Mansion Argent (11) — Reanimated/Gesture Handler creators

| Skill | Why | Lines |
|-------|-----|-------|
| `argent-react-native-app-workflow` | RN dev/debug workflow with Metro | ~60 |
| `argent-react-native-optimization` | Profile-first RN optimization | ~120 |
| `argent-react-native-profiler` | Hermes re-render/CPU profiling | ~120 |
| `argent-metro-debugger` | CDP Metro debugging | ~80 |
| `argent-screenshot-diff` | Visual regression testing | ~60 |
| `argent-device-interact` | Tap/swipe/type on simulators | ~100 |
| `argent-ios-simulator-setup` | iOS simulator boot/connect | ~60 |
| `argent-android-emulator-setup` | Android emulator boot/connect | ~60 |
| `argent-settings-permissions` | Grant/deny runtime permissions | ~80 |
| `argent-create-flow` | Record reusable interaction flows | ~60 |
| `argent-test-ui-flow` | Autonomous UI testing loop | ~100 |

#### State & Data (3)

| Skill | Why | Lines |
|-------|-----|-------|
| `tanstack-query` | Official TanStack Query v5 patterns (849 lines) | 849 |
| `zustand` | LobeHub Zustand store conventions | 202 |
| `react-state-management` | Redux/Zustand/Jotai/Query patterns | ~200 |

#### Styling (5)

| Skill | Why | Lines |
|-------|-----|-------|
| `nativewind` | Tailwind CSS for RN (official skill) | 57 |
| `tailwindcss` | Tailwind CSS utility framework | ~200 |
| `tailwind-design-system` | Design system with Tailwind tokens | ~200 |
| `uniwind` | Tailwind v4 for RN (Uniwind) | ~200 |
| `design-system-patterns` | Design tokens, theming, component arch | ~250 |

#### TypeScript (2)

| Skill | Why | Lines |
|-------|-----|-------|
| `typescript` | LobeHub TS style/type-safety guide | 74 |
| `typescript-advanced-types` | Generics, conditional/mapped types | ~200 |

#### Clerk Auth (11) — Official Clerk team

| Skill | Why | Lines |
|-------|-----|-------|
| `clerk` | Router to all Clerk skills | ~50 |
| `clerk-setup` | Clerk quickstart for any project | ~80 |
| `clerk-custom-ui` | Custom sign-in/sign-up flows | ~200 |
| `clerk-expo` | Expo-specific auth (has project-specific relevance) | 118 |
| `clerk-tanstack-patterns` | Clerk + TanStack integration | ~100 |
| `clerk-testing` | E2E testing for Clerk apps | ~150 |
| `clerk-webhooks` | Clerk webhook handling | ~200 |
| `clerk-cli` | Clerk CLI operations | ~200 |
| `clerk-backend-api` | Clerk REST API endpoints | ~200 |
| `clerk-orgs` | Multi-tenant orgs/RBAC | ~200 |
| `clerk-billing` | Subscription/payment management | ~200 |

#### Code Quality & SDLC (20)

| Skill | Why | Lines |
|-------|-----|-------|
| `code-review-and-quality` | Multi-axis code review (addyosmani) | 396 |
| `code-simplification` | Simplify without changing behavior | ~100 |
| `performance-optimization` | Frontend/backend/query perf | 350 |
| `security-and-hardening` | Input validation, auth, secrets | 467 |
| `debugging-and-error-recovery` | Systematic root-cause debugging | 300 |
| `debugging-strategies` | Profiling, tracing, RCA | ~200 |
| `frontend-ui-engineering` | Production-quality accessible UI | 328 |
| `error-handling-patterns` | Exceptions, Result types, graceful degredation | ~200 |
| `git-workflow-and-versioning` | Branching, commits, releases | 355 |
| `ci-cd-and-automation` | Pipeline setup and quality gates | ~200 |
| `documentation-and-adrs` | ADRs and architectural docs | ~200 |
| `architecture-decision-records` | ADR format and process | ~150 |
| `planning-and-task-breakdown` | Dependency graph, vertical slicing | ~200 |
| `incremental-implementation` | Small, reversible changes | ~150 |
| `source-driven-development` | Official-doc-grounded implementation | ~100 |
| `spec-driven-development` | Write specs before coding | ~200 |
| `shipping-and-launch` | Pre-launch checklist, rollback | ~150 |
| `dependency-upgrade` | Major version upgrade management | ~200 |
| `changelog-automation` | Keep a Changelog format | ~150 |
| `version-release` | Release process, GitHub Releases | ~100 |

#### Testing (6)

| Skill | Why | Lines |
|-------|-----|-------|
| `test-driven-development` | RED-GREEN-REFACTOR cycle | ~200 |
| `testing` | Vitest testing guide | 129 |
| `vitest` | Vitest unit testing framework | ~100 |
| `javascript-testing-patterns` | Jest/Vitest, mocking, fixtures | ~250 |
| `e2e-testing-patterns` | Playwright/Cypress E2E | ~250 |
| `browser-testing-with-devtools` | Real browser debugging via CDP | ~150 |

#### Accessibility (3)

| Skill | Why | Lines |
|-------|-----|-------|
| `accessibility-compliance` | WCAG 2.2 mobile accessibility | 51 |
| `wcag-audit-patterns` | WCAG audits with automated testing | ~200 |
| `screen-reader-testing` | VoiceOver/NVDA/JAWS testing | ~120 |

#### UI/UX/Design (7)

| Skill | Why | Lines |
|-------|-----|-------|
| `ux` | LobeHub product design values | ~200 |
| `ux-audit` | Pattern-language UX review | ~200 |
| `product-design` | Feature scoping and design | ~200 |
| `visual-design-foundations` | Typography, color, spacing | ~200 |
| `responsive-design` | Container queries, fluid typography | ~200 |
| `interaction-design` | Microinteractions, transitions | ~200 |
| `motion` | Motion animation library (Framer Motion) | ~150 |

#### Developer Experience (6)

| Skill | Why | Lines |
|-------|-----|-------|
| `context-engineering` | Optimize agent context setup | ~80 |
| `modern-javascript-patterns` | ES6+, async/await, functional | ~200 |
| `pnpm` | Package manager guidance | ~100 |
| `monorepo-management` | Turborepo/Nx workspace patterns | ~200 |
| `turborepo` | Turborepo pipeline/caching | ~200 |
| `i18n` | Internationalization (react-i18next) | 78 |

---

### 3b. Existing LOCAL Skills (6 — NO changes needed)

These are already in `.opencode/skills/` and should remain as-is. They are project-specific and override any global counterpart.

| Skill | Overlap with Global | Decision |
|-------|--------------------|----------|
| `expo-router-v4` | Overlaps with global `expo-router` | **KEEP BOTH** — local has project-specific routing tree + auth guards. Local takes precedence when loaded. |
| `nativewind-v4` | Overlaps with global `nativewind` | **KEEP BOTH** — local documents this project's specific HSL theme variables and font classes. |
| `reanimated-4` | Overlaps with Argent skills | **KEEP BOTH** — local is concise (159 lines), Argent skills add profiling/debugging. Complementary. |
| `tanstack-query-zustand` | Overlaps with global `tanstack-query` + `zustand` | **KEEP BOTH** — local is project-specific (Ky client, equran.id, bootstrap prefetch). Global adds depth. |
| `islamic-app-domain` | No overlap | **KEEP** — uniquely project-specific |
| `clerk-auth` | Overlaps with global `clerk-expo` | **KEEP BOTH** — local is project-specific (SecureStore, route guards, API client). Global adds breadth. |

### 3c. Skills to SKIP (337 skills)

| Category | Count | Example Skills | Reason |
|----------|-------|----------------|--------|
| **Python** | 20+ | `python-*`, `fastapi-*`, `airflow-*`, `dbt-*`, `uv-package-manager` | Wrong language stack |
| **Go** | 3 | `go-concurrency-patterns`, `go-*` | Wrong language stack |
| **Rust** | 2 | `rust-async-patterns`, `memory-safety-patterns` | Wrong language stack |
| **Vue/Nuxt** | 15+ | `vue*`, `nuxt*`, `pinia`, `unocss`, `uniapp*`, `vitepress`, `undocs` | Wrong framework |
| **Angular** | 1 | `angular-migration` | Wrong framework |
| **Flutter** | 1 | `flutter` | Wrong framework |
| **Next.js** | 3 | `next`, `nextjs-app-router-patterns`, `clerk-nextjs-patterns` | Wrong framework (web) |
| **Cloud/DevOps** | 20+ | `k8s-*`, `terraform-*`, `prometheus`, `grafana`, `istio`, `linkerd`, `helm-chart` | Not running infra here |
| **ML/AI Training** | 20+ | `langchain`, `rag-implementation`, `lora-qlora`, `grpo-rlvr`, `preference-optimization`, `vision-sft`, `quantized-export`, `finetuning-*`, `checkpoint-promotion`, `eval-harness`, `trace-to-training`, `dataset-curation` | Not doing ML training |
| **Blockchain/Web3** | 5 | `defi-protocol-templates`, `nft-standards`, `solidity-security`, `web3-testing`, `paypal-integration` | Not building blockchain |
| **Security (niche)** | 10+ | `binary-analysis`, `anti-reversing`, `memory-forensics`, `protocol-reverse`, `attack-tree`, `stride-analysis`, `threat-mitigation` | Overly niche security skills |
| **Desktop** | 3 | `electron`, `tauri`, `desktop` | Not building desktop apps |
| **Data/Backend** | 10+ | `spark-*`, `event-store`, `projection-patterns`, `cqrs-implementation`, `saga-orchestration` | Not relevant for mobile app |
| **PPTX** | 5 | `pptx-*` | Presentation creation — not applicable |
| **Clerk variants (web)** | 8 | `clerk-nextjs-patterns`, `clerk-nuxt-patterns`, `clerk-astro-patterns`, `clerk-vue-patterns`, `clerk-react-patterns`, `clerk-react-router-patterns`, `clerk-chrome-extension-patterns`, `clerk-swift`, `clerk-android` | Wrong platform (web/native variants) |
| **Audit skills** | 2 | `audit-clerk-skill`, `audit-expo-skill` | Skill-maintenance tools, not useful for app development |
| **Niche/Overly Specific** | 200+ | `hermes-tweet`, `employment-contract-templates`, `incident-runbook-templates`, `postmortem-writing`, `on-call-handoff-patterns`, `startup-financial-modeling`, `team-composition-analysis`, `market-sizing-analysis`, `kpi-dashboard-design`, `backtesting-frameworks`, `risk-metrics-calculation`, `recsys-pipeline-architect`, `godot-gdscript-patterns`, `unity-ecs-patterns`, `godot-gdscript-patterns`, `game-dev*`, `stripe-integration`, `billing-automation`, `gdpr-data-handling`, `pci-compliance`, `file-conversion`, `slidev`, `design-prototype`, `brand-landingpage`, `co-marketing`, `prospecting`, `lead-magnets`, etc. | Not relevant to mobile app development or this project |

---

## 4. Overlap Resolution

| Conflicting Skills | Resolution |
|--------------------|------------|
| `expo-router` (global) vs `expo-router-v4` (local) | **Keep both.** Local has project routing tree + auth guards. Global has deeper Expo Router v4 coverage. Local takes priority. |
| `nativewind` (global) vs `nativewind-v4` (local) | **Keep both.** Local has full HSL theme docs. Global adds generic patterns. |
| `tanstack-query` (global) vs `tanstack-query-zustand` (local) | **Keep both.** Global adds 849 lines of depth. Local is project-specific (Ky client, equran.id). |
| `zustand` (global) vs `tanstack-query-zustand` (local) | **Keep both.** Global adds LobeHub conventions. Local has project patterns. |
| `clerk-expo` (global) vs `clerk-auth` (local) | **Keep both.** Global adds breadth (setup, custom UI, testing). Local has project-specific guard patterns. |
| `argent-*` (global) vs `reanimated-4` (local) | **Keep both.** Argent is profiling/debugging-focused. Local is animation pattern-focused. Complementary. |

---

## 5. Execution Plan

### Prerequisites

```bash
# Ensure target directory exists
mkdir -p ~/.opencode/skills
```

### Phase 1: Expo & EAS (23 skills)

```bash
# Expo SDK
cp -r ~/.agents/skills/expo-app-clip ~/.opencode/skills/
cp -r ~/.agents/skills/expo-brownfield ~/.opencode/skills/
cp -r ~/.agents/skills/expo-data-fetching ~/.opencode/skills/
cp -r ~/.agents/skills/expo-dev-client ~/.opencode/skills/
cp -r ~/.agents/skills/expo-dom ~/.opencode/skills/
cp -r ~/.agents/skills/expo-examples ~/.opencode/skills/
cp -r ~/.agents/skills/expo-migrate-module ~/.opencode/skills/
cp -r ~/.agents/skills/expo-module ~/.opencode/skills/
cp -r ~/.agents/skills/expo-native-ui ~/.opencode/skills/
cp -r ~/.agents/skills/expo-project-structure ~/.opencode/skills/
cp -r ~/.agents/skills/expo-router ~/.opencode/skills/
cp -r ~/.agents/skills/expo-tailwind-setup ~/.opencode/skills/
cp -r ~/.agents/skills/expo-ui ~/.opencode/skills/
cp -r ~/.agents/skills/expo-upgrade ~/.opencode/skills/
cp -r ~/.agents/skills/expo-web-to-native ~/.opencode/skills/
cp -r ~/.agents/skills/expo-skill-eval ~/.opencode/skills/
cp -r ~/.agents/skills/expo-skill-feedback ~/.opencode/skills/

# EAS
cp -r ~/.agents/skills/eas-app-stores ~/.opencode/skills/
cp -r ~/.agents/skills/eas-hosting ~/.opencode/skills/
cp -r ~/.agents/skills/eas-observe ~/.opencode/skills/
cp -r ~/.agents/skills/eas-simulator ~/.opencode/skills/
cp -r ~/.agents/skills/eas-update-insights ~/.opencode/skills/
cp -r ~/.agents/skills/eas-workflows ~/.opencode/skills/
```

### Phase 2: React Native + Argent (18 skills)

```bash
# RN Core
cp -r ~/.agents/skills/react-native-best-practices ~/.opencode/skills/
cp -r ~/.agents/skills/react-native-architecture ~/.opencode/skills/
cp -r ~/.agents/skills/react-native-design ~/.opencode/skills/
cp -r ~/.agents/skills/react-native-expo ~/.opencode/skills/
cp -r ~/.agents/skills/react-native-reusables ~/.opencode/skills/
cp -r ~/.agents/skills/react-navigation ~/.opencode/skills/
cp -r ~/.agents/skills/upgrading-react-native ~/.opencode/skills/

# Argent (Software Mansion)
cp -r ~/.agents/skills/argent-react-native-app-workflow ~/.opencode/skills/
cp -r ~/.agents/skills/argent-react-native-optimization ~/.opencode/skills/
cp -r ~/.agents/skills/argent-react-native-profiler ~/.opencode/skills/
cp -r ~/.agents/skills/argent-metro-debugger ~/.opencode/skills/
cp -r ~/.agents/skills/argent-screenshot-diff ~/.opencode/skills/
cp -r ~/.agents/skills/argent-device-interact ~/.opencode/skills/
cp -r ~/.agents/skills/argent-ios-simulator-setup ~/.opencode/skills/
cp -r ~/.agents/skills/argent-android-emulator-setup ~/.opencode/skills/
cp -r ~/.agents/skills/argent-settings-permissions ~/.opencode/skills/
cp -r ~/.agents/skills/argent-create-flow ~/.opencode/skills/
cp -r ~/.agents/skills/argent-test-ui-flow ~/.opencode/skills/
```

### Phase 3: State, Styling, TypeScript (10 skills)

```bash
cp -r ~/.agents/skills/tanstack-query ~/.opencode/skills/
cp -r ~/.agents/skills/zustand ~/.opencode/skills/
cp -r ~/.agents/skills/react-state-management ~/.opencode/skills/
cp -r ~/.agents/skills/nativewind ~/.opencode/skills/
cp -r ~/.agents/skills/tailwindcss ~/.opencode/skills/
cp -r ~/.agents/skills/tailwind-design-system ~/.opencode/skills/
cp -r ~/.agents/skills/uniwind ~/.opencode/skills/
cp -r ~/.agents/skills/design-system-patterns ~/.opencode/skills/
cp -r ~/.agents/skills/typescript ~/.opencode/skills/
cp -r ~/.agents/skills/typescript-advanced-types ~/.opencode/skills/
```

### Phase 4: Clerk Auth (11 skills)

```bash
cp -r ~/.agents/skills/clerk ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-setup ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-custom-ui ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-expo ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-tanstack-patterns ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-testing ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-webhooks ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-cli ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-backend-api ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-orgs ~/.opencode/skills/
cp -r ~/.agents/skills/clerk-billing ~/.opencode/skills/
```

### Phase 5: Code Quality, SDLC, Testing (28 skills)

```bash
# Code quality
cp -r ~/.agents/skills/code-review-and-quality ~/.opencode/skills/
cp -r ~/.agents/skills/code-simplification ~/.opencode/skills/
cp -r ~/.agents/skills/performance-optimization ~/.opencode/skills/
cp -r ~/.agents/skills/security-and-hardening ~/.opencode/skills/
cp -r ~/.agents/skills/debugging-and-error-recovery ~/.opencode/skills/
cp -r ~/.agents/skills/debugging-strategies ~/.opencode/skills/
cp -r ~/.agents/skills/frontend-ui-engineering ~/.opencode/skills/
cp -r ~/.agents/skills/error-handling-patterns ~/.opencode/skills/

# SDLC
cp -r ~/.agents/skills/git-workflow-and-versioning ~/.opencode/skills/
cp -r ~/.agents/skills/ci-cd-and-automation ~/.opencode/skills/
cp -r ~/.agents/skills/documentation-and-adrs ~/.opencode/skills/
cp -r ~/.agents/skills/architecture-decision-records ~/.opencode/skills/
cp -r ~/.agents/skills/planning-and-task-breakdown ~/.opencode/skills/
cp -r ~/.agents/skills/incremental-implementation ~/.opencode/skills/
cp -r ~/.agents/skills/source-driven-development ~/.opencode/skills/
cp -r ~/.agents/skills/spec-driven-development ~/.opencode/skills/
cp -r ~/.agents/skills/shipping-and-launch ~/.opencode/skills/
cp -r ~/.agents/skills/dependency-upgrade ~/.opencode/skills/
cp -r ~/.agents/skills/changelog-automation ~/.opencode/skills/
cp -r ~/.agents/skills/version-release ~/.opencode/skills/

# Testing
cp -r ~/.agents/skills/test-driven-development ~/.opencode/skills/
cp -r ~/.agents/skills/testing ~/.opencode/skills/
cp -r ~/.agents/skills/vitest ~/.opencode/skills/
cp -r ~/.agents/skills/javascript-testing-patterns ~/.opencode/skills/
cp -r ~/.agents/skills/e2e-testing-patterns ~/.opencode/skills/
cp -r ~/.agents/skills/browser-testing-with-devtools ~/.opencode/skills/
```

### Phase 6: Accessibility, UX/Design, DX (16 skills)

```bash
# Accessibility
cp -r ~/.agents/skills/accessibility-compliance ~/.opencode/skills/
cp -r ~/.agents/skills/wcag-audit-patterns ~/.opencode/skills/
cp -r ~/.agents/skills/screen-reader-testing ~/.opencode/skills/

# UX/Design
cp -r ~/.agents/skills/ux ~/.opencode/skills/
cp -r ~/.agents/skills/ux-audit ~/.opencode/skills/
cp -r ~/.agents/skills/product-design ~/.opencode/skills/
cp -r ~/.agents/skills/visual-design-foundations ~/.opencode/skills/
cp -r ~/.agents/skills/responsive-design ~/.opencode/skills/
cp -r ~/.agents/skills/interaction-design ~/.opencode/skills/
cp -r ~/.agents/skills/motion ~/.opencode/skills/

# DX
cp -r ~/.agents/skills/context-engineering ~/.opencode/skills/
cp -r ~/.agents/skills/modern-javascript-patterns ~/.opencode/skills/
cp -r ~/.agents/skills/pnpm ~/.opencode/skills/
cp -r ~/.agents/skills/monorepo-management ~/.opencode/skills/
cp -r ~/.agents/skills/turborepo ~/.opencode/skills/
cp -r ~/.agents/skills/i18n ~/.opencode/skills/
```

### Verification

```bash
# Count activated skills
ls ~/.opencode/skills/ | wc -l
# Expected: 104

# Verify no collisions with local project skills
ls .opencode/skills/   # Should still have 6 local skills

# Spot-check a few SKILL.md files load correctly
head -3 ~/.opencode/skills/expo-data-fetching/SKILL.md
head -3 ~/.opencode/skills/tanstack-query/SKILL.md
```

---

## 6. Summary

| Category | Count |
|----------|-------|
| **GLOBAL to activate** | 104 |
| **LOCAL (existing, keep)** | 6 |
| **SKIP (not applicable)** | 337 |
| **Total in `~/.agents/skills/`** | 441 |

**104 cp commands** to activate the subset. Alternatively, use `rsync` or a script for efficiency.

---

## 7. Open Question

The skills at `~/.agents/skills/` are **already discoverable** by OpenCode (they appear in the system prompt's `available_skills` list). Do you still want to copy them to `~/.opencode/skills/` for explicit activation, or is the current discovery mechanism sufficient? Copying gives you curation control but duplicates disk space (~200MB total).

---

**Ready for review. Approve to execute the `cp` commands.** 
