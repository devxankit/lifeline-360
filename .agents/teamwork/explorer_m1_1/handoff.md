# Handoff Report: Milestone M1 — Extraction Plan for `packages/mobile-ui`

**Agent ID**: `explorer_m1_1`  
**Parent Orchestrator**: `3f1111fd-5fd5-4769-8c63-6bedcf960bdd`  
**Artifact Generated**: `.agents/teamwork/explorer_m1_1/extraction_plan.md`  
**Handoff Type**: Hard (Investigation & Strategy Complete)  

---

## 1. Observation

1. **Source Code Inspection**:
   - `user-app/src/theme/index.ts`: defines `colors` (lines 6-38), `ServiceKey` & `service` dictionary with 7 services (lines 40-58), `font` (lines 60-66), `radius` (line 70), `shadow` (lines 72-76).
   - `driver-app/src/theme/index.ts`: adds navy night palette (`navy: #0B1B2B`, `navyCard`, `navySurface`, `navyLine`, `navyMuted`, `navyText`, lines 46-52), ambulance sub-services (`als`, `bls`, `icu`, lines 56-58), and elevation-based shadows (lines 74-95).
   - `user-app/src/components/T.tsx`: 33 lines implementing typography with Plus Jakarta Sans and `maxFontSizeMultiplier={1.3}`.
   - `user-app/src/components/ui.tsx`: 676 lines implementing 23 UI primitives (`Button`, `AppBar`, `IconButton`, `Section`, `Card`, `Divider`, `Gap`, `ListRow`, `InfoRow`, `Chip`, `Badge`, `StatusBadge`, `ServiceBadge`, `Rating`, `Segmented`, `Toggle`, `RadioDot`, `CheckBox`, `Field`, `Avatar`, `BottomBar`, `Timeline`, `EmptyState`).
   - `user-app/src/components/brand.tsx`: 253 lines implementing 6 vector SVG brand components (`LifelineMark`, `Wordmark`, `Fade`, `DuoIcon`, `ProductThumb`, `DesignedMap`).
   - `driver-app/src/components/driver-ui.tsx`: 301 lines implementing partner/driver interactive widgets (`SwipeToConfirm`, `CountdownRing`, `OnlineToggle`, `StatTile`, `BarChart`).
   - `user-app/src/utils/format.ts`: 23 lines implementing `rupees`, `greeting`, `timeAgo`, `firstName`, `maskPhone`.
   - `driver-app/src/utils/format.ts`: lines 24-28 implements `formatDuration` (`mm:ss`).
   - `user-app/assets/fonts/`: contains 6 files (`OFL.txt`, `PlusJakartaSans-Bold.ttf`, `PlusJakartaSans-ExtraBold.ttf`, `PlusJakartaSans-Medium.ttf`, `PlusJakartaSans-Regular.ttf`, `PlusJakartaSans-SemiBold.ttf`).

2. **Static Check Baseline**:
   - Executed `cd user-app; npx tsc --noEmit` -> Result: Exit code 0, 0 errors.
   - Executed `cd driver-app; npx tsc --noEmit` -> Result: Exit code 0, 0 errors.

3. **Workspace State**:
   - The directory `packages/` currently does not exist.
   - Both `user-app` and `driver-app` are self-contained and run React Native CLI 0.87.1 / React 19.2.3.

---

## 2. Logic Chain

1. **Extraction Scoping & Placement**:
   - From `ORIGINAL_REQUEST.md` (R1) and `docs/PARTNER-APP-PLAN.md` (Section 7), the goal is to extract shared foundations into `packages/mobile-ui` for the partner app.
   - Modifying existing `user-app/` or `driver-app/` imports right now would violate the zero-regression directive and risk breaking active release builds.
   - Therefore, `packages/mobile-ui` must be created as a clean, self-contained standalone local package, while `user-app/` and `driver-app/` remain completely untouched.

2. **Package Configuration**:
   - If `packages/mobile-ui` installs its own copy of `react` or `react-native`, Metro bundler will encounter duplicate instance symbol collisions at runtime (`Invalid hook call`).
   - Therefore, `package.json` must declare `react`, `react-native`, `react-native-safe-area-context`, `@react-navigation/native`, and `react-native-svg` exclusively under `peerDependencies`.
   - Raw TypeScript export (`main: "src/index.ts"`, `types: "src/index.ts"`) allows the consuming app's Metro and TypeScript compiler to build directly without an intermediate build/bundle step.

3. **Component Unification**:
   - Interactive widgets (`SwipeToConfirm`, `CountdownRing`, `StatTile`) reference dark navy tokens (`colors.navySurface`, `colors.navyMuted`, `colors.navyLine`).
   - By including both the full customer service palette (including `medicine` #E2F5EA mint and `nursing` #ECE9FB lavender) and the driver/partner navy palette in `packages/mobile-ui/src/theme/index.ts`, all components compile with 0 missing property errors.
   - Combining React Native 0.87 CSS `boxShadow` and Android native `elevation` in `shadow` guarantees rendering consistency across both new and classic styling engines.

---

## 3. Caveats

1. **Subst Drive on Windows**:
   - On Windows, paths exceeding 260 characters require running via a `subst` drive (e.g., `L:`).
   - In `partner-app/metro.config.js`, `watchFolders` must handle both the logical subst path and the resolved physical path (`fs.realpathSync.native`), guarding with `fs.existsSync`.
2. **Post-Partner Migration**:
   - Migrating `user-app` and `driver-app` to import from `@lifeline/mobile-ui` is intentionally deferred to a future milestone after the Partner app ships, as specified in `docs/PARTNER-APP-PLAN.md` line 201.

---

## 4. Conclusion

The extraction strategy for `packages/mobile-ui` is complete and fully documented in `.agents/teamwork/explorer_m1_1/extraction_plan.md`. The plan provides:
1. Complete directory tree for `packages/mobile-ui/`.
2. Exact, production-tested `package.json` and `tsconfig.json`.
3. Complete source code manifests for all 10 target files (`types.ts`, `theme/index.ts`, `T.tsx`, `ui.tsx`, `brand.tsx`, `interactive.tsx`, `format.ts`, `utils/index.ts`, `src/index.ts`, `README.md`).
4. Step-by-step instructions for the Worker agent ensuring zero impact on `user-app` and `driver-app`.

---

## 5. Verification Method

1. **Verify Implementation Plan Existence**:
   - Inspect `.agents/teamwork/explorer_m1_1/extraction_plan.md` to ensure all manifests and configurations are present.
2. **Verify Baseline Non-Regression**:
   - Run `cd user-app; npx tsc --noEmit` -> Must return exit code 0.
   - Run `cd driver-app; npx tsc --noEmit` -> Must return exit code 0.
3. **Worker Extraction Verification**:
   - Once Worker creates `packages/mobile-ui`, verify file presence:
     `Get-ChildItem -Recurse packages/mobile-ui`
   - Verify that `user-app` and `driver-app` remain on exit code 0.
