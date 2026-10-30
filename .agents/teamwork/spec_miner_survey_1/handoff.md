# Handoff Report: Specification Mining Survey (Lifeline Partner App)

**Agent:** `spec_miner_survey_1`  
**Working Directory:** `.agents/teamwork/spec_miner_survey_1/`  
**Recipient / Parent Orchestrator:** `3f1111fd-5fd5-4769-8c63-6bedcf960bdd`  
**Handoff Type:** Hard (Task complete)

---

## 1. Observation

Direct observations from authoritative files, codebases, and tool executions:

1. **Original User Request (`.agents/teamwork/ORIGINAL_REQUEST.md`):**
   - Lines 5-8: "Build the native Android Partner app (Lifeline Partner) for Lifeline 360 as a capability showcase serving Medicine Vendor and Nursing/Caretaker roles, following docs/NATIVE-APP-PLAYBOOK.md and docs/PARTNER-APP-PLAN.md. Working directory: partner-app. Integrity mode: development."
   - Lines 30-40:
     - "Release APK is built successfully at `partner-app/android/app/build/outputs/apk/release/app-release.apk` (or copied to `partner-app/release/`)."
     - "`apksigner verify --print-certs` on the release APK verifies successfully with the dedicated partner release certificate (not the Android debug certificate)."
     - "`aapt2 dump badging` on the release APK confirms package name `com.lifeline360.partner` and application label 'Lifeline Partner'."
     - "`npx tsc --noEmit` passes with 0 errors in `partner-app/`."
     - "`npx eslint src` passes with 0 errors in `partner-app/`."
     - "Automated unit tests (`npx jest`) pass for core business logic, including order state transitions, booking state transitions, earnings calculations, and simulator availability filtering."

2. **Native App Playbook (`docs/NATIVE-APP-PLAYBOOK.md`):**
   - Lines 188-196 (Release Guard):
     ```groovy
     gradle.taskGraph.whenReady { graph ->
         def releaseTask = graph.allTasks.any { t ->
             (t.name.startsWith('assemble') || t.name.startsWith('bundle')) && t.name.toLowerCase().contains('release')
         }
         if (releaseTask && !keystorePropsFile.exists()) {
             throw new GradleException("Release signing is not set up: ${keystorePropsFile} is missing.")
         }
     }
     ```
   - Lines 203-205 (Windows 260-char path limit):
     ```powershell
     subst L: "C:\Users\<you>\OneDrive\Desktop\<project>"
     cd L:\<app-folder>\android
     ```
   - Lines 210-214 (Metro subst watchFolders fix):
     ```javascript
     const fs = require('fs');
     const realRoot = fs.realpathSync.native(__dirname);
     const config = { watchFolders: realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : [] };
     ```

3. **Partner App Plan (`docs/PARTNER-APP-PLAN.md`):**
   - Section 1-4: Details 43 screens across Shared (~12), Vendor (~16, tabs: Orders, Catalogue, Earnings, Profile), Caretaker (~15, tabs: Today, Requests, Earnings, Profile).
   - Section 7 (Shared package):
     "`packages/mobile-ui/` ... name: `@lifeline/mobile-ui` (private, 'main': 'src/index.ts'). Each app adds `'@lifeline/mobile-ui': 'file:../packages/mobile-ui'` and points Metro at it with `watchFolders`."
   - Section 8:
     - Package name: `com.lifeline360.partner`
     - App name: `"Lifeline Partner"`
     - App icon: "the Lifeline mark on a mint tile, so partners can tell it apart from the User (white) and Driver (navy) apps."
     - Keystore: `lifeline360-partner-upload.keystore`

4. **Existing Implementations (`user-app/` and `driver-app/`):**
   - `driver-app/android/app/build.gradle`:
     - Line 89: `namespace "com.lifeline360.driver"`
     - Line 91: `applicationId "com.lifeline360.driver"`
     - Lines 104-111: `signingConfigs { release { storeFile file(keystoreProps['storeFile']) ... } }`
   - `driver-app/release/Lifeline360-Driver-1.0.0.apk`:
     - Tool execution `aapt2 dump badging`: confirmed `package: name='com.lifeline360.driver' ... application-label:'Lifeline Driver'`.
     - Tool execution `apksigner verify --print-certs`: confirmed `Signer #1 certificate DN: CN=Lifeline 360 Driver, O=Lifeline 360, C=IN`.
   - Tool execution environment checks:
     - Node: `v22.13.1`
     - JDK 17: `C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot`
     - Android SDK: `C:\Android` with Build Tools `35.0.0`, `36.0.0`, `37.0.0`, Platforms `android-35`, `android-36`, `android-37.0`, NDK `27.1.12297006`.
     - Drive substitution: `subst` confirmed `L:\: => C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360` is already mapped and functional.

---

## 2. Logic Chain

1. **Step 1: Role and Navigation Decoupling**  
   From Observation 1 and 3, `partner-app` combines two distinct operational roles (Medicine Vendor and Caretaker) within a single binary. Because a single account selects exactly one role upon onboarding and never switches during an active session, the root navigator must branch immediately after auth/KYC approval into either `VendorTabs` or `CaretakerTabs`. Neither role's navigation stack or feature set leaks into the other.

2. **Step 2: Shared Package Monorepo Extraction**  
   From Observation 3 (§7) and Observation 4, `user-app/src/components/` (`T.tsx`, `ui.tsx`, `brand.tsx`), `user-app/src/theme/`, `user-app/src/utils/format.ts`, and shared screens (`CallScreen`, `NotificationsScreen`, `HelpScreen`, `LegalScreen`) must be extracted into `packages/mobile-ui`. Setting its package name to `@lifeline/mobile-ui` and referencing it via `"file:../packages/mobile-ui"` allows `partner-app` to import shared components without code duplication.

3. **Step 3: Toolchain and Path Resolution via `subst L:`**  
   From Observation 2 (§4.8) and Observation 4, Windows native builds inside OneDrive fail unless short paths are used. Mounting the root to `L:` resolves the 260-char C++ limit. Concurrently, Metro must watch both virtual drive `L:` and physical `C:\...` paths for both `partner-app` and `packages/mobile-ui` to avoid `Failed to get the SHA-1` errors.

4. **Step 4: Release Guard and Cryptographic Signing**  
   From Observation 1, 2, and 4, release builds require a dedicated keystore (`lifeline360-partner-upload.keystore`) generated with DN `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`. The Gradle Release Guard in `app/build.gradle` ensures that any `assembleRelease` task without `keystore.properties` fails immediately, preventing unsigned or debug-signed releases from being created.

5. **Step 5: Quality Gate Compliance**  
   From Observation 1, 3, and 4, strict zero-error thresholds on `npx tsc --noEmit` and `npx eslint src` combined with comprehensive Jest tests covering order/booking state transitions, earnings arithmetic, and availability filtering satisfy all automated validation criteria.

---

## 3. Caveats

1. **Pre-existing Drive `L:`:** Drive `L:` is currently mapped to `C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360`. On machine reboot, Windows removes `subst` mappings. Subsequent builder agents should verify or re-execute `subst L: "C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360"`.
2. **Icon Source:** The icon generation script depends on `assets/brand/logo-full.png` which is present in `user-app/assets/brand/logo-full.png`. It must be copied to `partner-app/assets/brand/` for `partner-app/scripts/generate-icons.py` to execute.
3. **No Code Implementation in this Phase:** Per role constraints, this survey is purely observational and analytical. No files in `packages/` or `partner-app/` were modified or created.

---

## 4. Conclusion

All technical, build, packaging, release signing, quality, and architecture specifications for the Lifeline Partner app have been mined and documented in full detail in `.agents/teamwork/spec_miner_survey_1/spec_report.md`.

Key specifications confirmed:
- **Package Name:** `com.lifeline360.partner`
- **Application Label:** `Lifeline Partner`
- **App Icon:** Lifeline 4-petal mark on Mint tile (`#E2F5EA`)
- **Shared Package:** `packages/mobile-ui` (`@lifeline/mobile-ui`)
- **Release Keystore:** `lifeline360-partner-upload.keystore`, alias `lifeline360-partner-upload`, DN `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`
- **Output APK:** `partner-app/android/app/build/outputs/apk/release/app-release.apk` & `partner-app/release/Lifeline360-Partner-1.0.0.apk`
- **Verification Tools:** `apksigner` and `aapt2` at `C:\Android\build-tools\36.0.0\`
- **Catalog of Features:** 42 discovered features and 25 edge cases fully probed and tabulated.

The project is fully ready for scaffolding, shared package creation, and implementation.

---

## 5. Verification Method

To independently verify the mining findings:

1. **Inspect Specification Report:**
   - Path: `c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\.agents\teamwork\spec_miner_survey_1\spec_report.md`
   - Check coverage of Sections 1 to 6, Features Discovered table (42 items), and Edge Cases table (25 items).
2. **Verify Toolchain Paths on Host Machine:**
   ```powershell
   & "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot\bin\java.exe" -version
   & "C:\Android\build-tools\36.0.0\apksigner.bat" --version
   & "C:\Android\build-tools\36.0.0\aapt2.exe" version
   subst
   ```
3. **Verify Reference Release Verification Commands on Driver App:**
   ```powershell
   & "C:\Android\build-tools\36.0.0\aapt2.exe" dump badging "c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\driver-app\release\Lifeline360-Driver-1.0.0.apk" | Select-String "package|application-label"
   $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
   & "C:\Android\build-tools\36.0.0\apksigner.bat" verify --print-certs "c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\driver-app\release\Lifeline360-Driver-1.0.0.apk"
   ```
4. **Invalidation Conditions:**
   - If `ORIGINAL_REQUEST.md` changes role requirements or package name.
   - If Windows drive `L:` mapping is changed to a different directory.
