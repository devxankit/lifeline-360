# Handoff Report: Mobile Codebase Survey & UI Kit Extraction Plan

**Agent**: `explorer_survey_1`  
**Date**: 2026-10-29T11:08:00Z  
**Recipient**: `3f1111fd-5fd5-4769-8c63-6bedcf960bdd` (Parent Orchestrator)  
**Deliverable Document**: `.agents/teamwork/explorer_survey_1/codebase_report.md`  

---

## 1. Observation

1. **Root Directory Structure**:
   `list_dir` on `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360` returned:
   - Directories: `.agents`, `.git`, `backend`, `docs`, `driver-app`, `frontend`, `tools`, `user-app`.
   - Files: `.gitignore`, `README.md`.
   - `packages/` does not exist in the workspace root.
2. **Existing Mobile Apps**:
   - `user-app/package.json` lines 18-23 specify:
     ```json
     "react": "19.2.3",
     "react-native": "0.87.1",
     "react-native-safe-area-context": "^5.5.2",
     "react-native-screens": "^4.30.1",
     "react-native-svg": "^15.16.0"
     ```
   - `user-app/android/app/build.gradle` lines 89-96 define `namespace "com.lifeline360.user"` and `applicationId "com.lifeline360.user"`.
   - `user-app/release/Lifeline360-User-1.0.0.apk` is present (56,219,491 bytes).
   - `driver-app/android/app/build.gradle` lines 89-96 define `namespace "com.lifeline360.driver"` and `applicationId "com.lifeline360.driver"`.
   - `driver-app/release/Lifeline360-Driver-1.0.0.apk` is present (27,488,453 bytes).
   - Running `cd user-app; npx tsc --noEmit` and `cd driver-app; npx tsc --noEmit` both completed with exit code 0 and 0 errors.
3. **Shared Theme & UI Tokens**:
   - `user-app/src/theme/index.ts` lines 6-38 declare the `colors` token object (core teal `#128078`, ink `#1C2340`, neutrals, alert pastels).
   - `user-app/src/theme/index.ts` lines 50-58 declare `service` tokens for all 7 domains: `doctor` (`#DDF1EC`), `medicine` (`#E2F5EA`), `nursing` (`#ECE9FB`), `ambulance` (`#FDECEC`), `lab` (`#E3EFFB`), `blood` (`#FDE8EF`), `membership` (`#FFF6DA`).
   - `user-app/src/theme/index.ts` lines 60-66 define `font` tokens for `PlusJakartaSans` weights (`regular`, `medium`, `semibold`, `bold`, `extrabold`).
   - `user-app/assets/fonts/` contains the 5 TTF font files + `OFL.txt`.
   - `driver-app/src/theme/index.ts` lines 46-52 add the high-contrast `navy` palette (`#0B1B2B`, `#13263A`, `#182E46`, etc.).
4. **UI Components & Utilities**:
   - `user-app/src/components/ui.tsx` (676 lines) exports 23 components: `Button`, `AppBar`, `IconButton`, `Section`, `Card`, `Divider`, `Gap`, `ListRow`, `InfoRow`, `Chip`, `Badge`, `StatusBadge`, `ServiceBadge`, `Rating`, `Segmented`, `Toggle`, `RadioDot`, `CheckBox`, `Field`, `Avatar`, `BottomBar`, `Timeline`, `EmptyState`.
   - `user-app/src/components/brand.tsx` (253 lines) exports 6 SVG brand components: `LifelineMark`, `Wordmark`, `Fade`, `DuoIcon`, `ProductThumb`, `DesignedMap`.
   - `driver-app/src/components/driver-ui.tsx` (301 lines) exports 5 interactive components: `SwipeToConfirm`, `CountdownRing`, `OnlineToggle`, `StatTile`, `BarChart`.
   - `user-app/src/utils/format.ts` and `driver-app/src/utils/format.ts` provide formatting helpers (`rupees`, `greeting`, `timeAgo`, `firstName`, `maskPhone`, `formatDuration`).
   - Utility screens exist across `checkout.tsx` (`CallScreen`), `home.tsx` (`NotificationsScreen`), and `profile.tsx` (`HelpScreen`, `LegalScreen`, `ComplaintScreen`).
5. **Build Toolchain & Windows Environment**:
   - `node -v` output: `v22.13.1`.
   - `python --version` output: `Python 3.13.2`.
   - JDK 17 verified at `C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot` (version: `17.0.13+11-LTS`).
   - Android SDK verified at `C:\Users\AnkitAhirwar\AppData\Local\Android\Sdk` (build-tools: `34.0.0`, `35.0.0`, `35.0.1`; platforms: `android-34`, `android-35`).
   - `subst` command output: `L:\: => C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360` (Windows 260-char workaround is already mounted and active).

---

## 2. Logic Chain

1. **Monorepo / Package Wiring Feasibility**:
   - From Observation 1, the repository is structured as independent peer folders without a root package manager workspace.
   - From Observation 2, `user-app` and `driver-app` are self-contained React Native 0.87.1 CLI apps that depend on local `node_modules`.
   - If a local package `packages/mobile-ui` is introduced with `@lifeline/mobile-ui` declaring `peerDependencies` (and no nested `node_modules` of its own), Metro bundler in `partner-app` can resolve it cleanly without dual-React conflicts when `watchFolders` includes `../packages/mobile-ui`.
   - Because Windows OneDrive paths can exceed 260 chars and Metro needs to resolve both real and `subst` drives, `metro.config.js` in `partner-app` must include both `realRoot` and `realPackages` in `watchFolders`, identical to the proven configuration in `user-app/metro.config.js` and `driver-app/metro.config.js`.
2. **UI Kit Extraction Safety**:
   - From Observation 3 and 4, `user-app/src/theme/index.ts`, `user-app/src/components/T.tsx`, `ui.tsx`, `brand.tsx`, `driver-ui.tsx`, and `format.ts` have zero hardcoded dependencies on user-specific store models (unlike `pickers.tsx`, which explicitly imports `useStore` from `AppStore`).
   - Therefore, these components can be directly extracted into `packages/mobile-ui/src/` as a pure design system kit.
   - To guarantee zero regressions to `user-app` and `driver-app` (Observation 2: both have working signed release APKs and pass `tsc` with 0 errors), `user-app` and `driver-app` will NOT have their source files modified in this step. They will be migrated to consume `@lifeline/mobile-ui` in a future isolated step as instructed in `docs/PARTNER-APP-PLAN.md` line 201.
3. **Partner App Architecture**:
   - In accordance with `docs/PARTNER-APP-PLAN.md` and `docs/ORIGINAL_REQUEST.md`, `partner-app` requires two distinct operational roles: Medicine Vendor (mint accent) and Nursing/Caretaker (lavender accent).
   - A single unified context store (`PartnerStore.tsx`) backed by `AsyncStorage` will persist the chosen role, KYC approval state, store opening toggle, and simulator engines (`orderSimulator.ts`, `requestSimulator.ts`).
   - Navigation will mount either `VendorTabs` or `CaretakerTabs` based on `role`, maintaining strict separation of concerns.

---

## 3. Caveats

1. **Local Package Linking on Windows**:
   When using `"@lifeline/mobile-ui": "file:../packages/mobile-ui"`, npm creates a symlink or direct copy inside `node_modules`. To ensure seamless TypeScript compilation without relying on Windows symlink permissions, `partner-app/tsconfig.json` must include path aliases (`"@lifeline/mobile-ui": ["../packages/mobile-ui/src/index.ts"]`).
2. **Native Modules for Partner Features**:
   Features specified in `PARTNER-APP-PLAN.md` (e.g. `react-native-image-picker` for KYC document capture, `@react-native-community/geolocation` for caretaker check-in, and `@sayem314/react-native-keep-awake`) require native autolinking. The project build tools (AGP, CMake, NDK) are present in the Android SDK, and `L:\` drive mapping must remain active during Gradle compilation.

---

## 4. Conclusion

1. The codebase is well-structured and ready for the extraction of `packages/mobile-ui` and the scaffolding of `partner-app`.
2. `packages/mobile-ui` will provide a unified theme (`colors`, `service`, `font`, `radius`, `shadow`), core components (`T`, `Button`, `AppBar`, `Card`, `Field`, `Timeline`, etc.), brand SVGs (`LifelineMark`, `Wordmark`, `Fade`, `ProductThumb`, `DesignedMap`), and interactive partner widgets (`CountdownRing`, `SwipeToConfirm`, `BarChart`, `OnlineToggle`).
3. `partner-app` will be scaffolded at `partner-app/` with package `com.lifeline360.partner`, application label "Lifeline Partner", a mint-tile app icon, and dedicated release signing.
4. Detailed inventory, architecture specifications, file layouts, and execution steps are documented in `.agents/teamwork/explorer_survey_1/codebase_report.md`.

---

## 5. Verification Method

1. **Verify Report & Handoff Existence**:
   - Inspect `.agents/teamwork/explorer_survey_1/codebase_report.md`
   - Inspect `.agents/teamwork/explorer_survey_1/handoff.md`
2. **Verify Toolchain & Environment Readiness**:
   - `& "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot\bin\java.exe" -version` confirms OpenJDK 17.
   - `subst` confirms `L:\: => C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360`.
   - `node -v` confirms `v22.13.1`.
3. **Verify Existing Apps Integrity**:
   - `cd user-app && npx tsc --noEmit` exits with 0 errors.
   - `cd driver-app && npx tsc --noEmit` exits with 0 errors.
   - Confirm existence of `user-app/release/Lifeline360-User-1.0.0.apk` and `driver-app/release/Lifeline360-Driver-1.0.0.apk`.
