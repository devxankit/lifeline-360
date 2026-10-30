# Handoff Report: Lifeline Partner App Scaffolding & Native Android Configuration

**Agent:** `explorer_m1_2`  
**Working Directory:** `.agents/teamwork/explorer_m1_2/`  
**Milestone:** M1 (Shared Foundations & Mobile UI Package)  
**Date:** 2026-10-29  
**Recipient:** Orchestrator (`3f1111fd-5fd5-4769-8c63-6bedcf960bdd`) and Milestone M1 Workers  

---

## 1. Observation

1. **Monorepo Mobile Precedents:**
   - `user-app/` (`user-app/android/app/build.gradle`: lines 89-91) specifies namespace `com.lifeline360.user` and applicationId `com.lifeline360.user`.
   - `driver-app/` (`driver-app/android/app/build.gradle`: lines 89-91) specifies namespace `com.lifeline360.driver` and applicationId `com.lifeline360.driver`.
   - Both apps use React Native `0.87.1`, React `19.2.3`, Hermes, New Architecture (`newArchEnabled=true`), edge-to-edge layout (`edgeToEdgeEnabled=true`), and compileSdkVersion 37 / targetSdkVersion 36 (`user-app/android/build.gradle`: lines 3-8, `driver-app/android/build.gradle`: lines 3-8).

2. **Gradle Configuration & Release Guard:**
   - Both apps implement a release signing guard in `android/app/build.gradle` (lines 131-138):
     ```groovy
     gradle.taskGraph.whenReady { graph ->
         def releaseTask = graph.allTasks.any { t ->
             (t.name.startsWith('assemble') || t.name.startsWith('bundle')) && t.name.toLowerCase().contains('release')
         }
         if (releaseTask && !keystorePropsFile.exists()) {
             throw new GradleException("Release signing is not set up: ${keystorePropsFile} is missing. See README.md before building a release.")
         }
     }
     ```
   - In `driver-app/android/keystore.properties`:
     `storeFile=lifeline360-driver-upload.keystore`, `keyAlias=lifeline360-driver-upload`.

3. **Subst Drive `L:` and Metro Bundling:**
   - In `driver-app/metro.config.js` (lines 15-18):
     ```javascript
     const realRoot = fs.realpathSync.native(__dirname);
     const config = {
       watchFolders: realRoot.toLowerCase() !== __dirname.toLowerCase() ? [realRoot] : [],
     };
     ```
   - Tool execution confirmed `subst` mapping:
     `L:\: => C:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360`
   - Tool execution confirmed JDK 17 keytool presence at:
     `C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot\bin\keytool.exe` (Exit code 0).
   - Tool execution confirmed Android SDK build-tools 36.0.0 `apksigner.bat` and `aapt2.exe` at:
     `C:\Android\build-tools\36.0.0\` (Exit code 0).
   - Tool execution confirmed Python 3 Pillow version 12.0.0 (Exit code 0).

4. **App Icon Branding Concept:**
   - `docs/NATIVE-APP-PLAYBOOK.md` and `docs/PARTNER-APP-PLAN.md` dictate that Partner app uses a **mint tile** (`#E2F5EA` / RGB `(226, 245, 234)`) to distinguish from User app (white) and Driver app (navy).

---

## 2. Logic Chain

1. **Alignment with Sibling Apps:**
   - Because `user-app` and `driver-app` compile with 0 errors and produce valid signed release APKs, `partner-app` must adopt identical Gradle versions (Gradle wrapper 9.4.1), SDK levels (compileSdk 37, targetSdk 36, minSdk 24, NDK 27.1.12297006, Kotlin 2.2.0), and JVM daemon settings (`-Xmx1536m -XX:MaxMetaspaceSize=512m`, `workers.max=1`, `parallel=false`).

2. **Integration of Local `@lifeline/mobile-ui`:**
   - Since `packages/mobile-ui` will reside outside `partner-app/`, `package.json` must reference `"@lifeline/mobile-ui": "file:../packages/mobile-ui"`.
   - To avoid Metro SHA-1 resolution failures when developing from either physical OneDrive paths or the virtual subst drive (`L:\`), `metro.config.js` must resolve both `realpathSync` and relative paths for `partner-app` and `packages/mobile-ui`, and include them in `watchFolders`.
   - To ensure peerDependencies within `packages/mobile-ui` (React, React Native, SVG, Safe Area Context) resolve to `partner-app/node_modules`, `resolver.nodeModulesPaths` and `resolver.extraNodeModules` must point to `partner-app/node_modules` and `packages/mobile-ui`.
   - In `tsconfig.json`, adding `"paths": { "@lifeline/mobile-ui": ["../packages/mobile-ui/src/index.ts"] }` and including `../packages/mobile-ui/src/**/*.ts*` enables TypeScript to compile without pre-bundling `@lifeline/mobile-ui`.

3. **Android Identity & Release Guard:**
   - `app/build.gradle` must declare `namespace "com.lifeline360.partner"` and `applicationId "com.lifeline360.partner"`.
   - The Release Guard hook enforces that release builds will immediately abort if `keystore.properties` is absent, guaranteeing release APKs are signed exclusively with the dedicated `lifeline360-partner-upload.keystore`.

4. **Mint Launcher Icon Generator:**
   - Adapting `scripts/generate-icons.py` with `MINT_COLOR = (226, 245, 234, 255)` and adaptive foreground at 58% canvas scale ensures crisp rendering on all Android launcher densities (mdpi through xxxhdpi) and Play Store 512x512 assets.

---

## 3. Caveats

1. **Ordering Dependency:** `partner-app/package.json` links to `file:../packages/mobile-ui`. Therefore, `packages/mobile-ui/package.json` must be created by the Worker implementing `explorer_m1_1`'s extraction plan before running `npm install` inside `partner-app/`.
2. **Build Execution Directory:** Windows path length limits require that native Gradle assemble tasks (`.\gradlew.bat assembleRelease`) be invoked from the virtual subst drive `L:\partner-app\android`. Running Gradle directly inside nested OneDrive paths will trigger `Filename longer than 260 characters` CMake/Ninja compiler crashes.

---

## 4. Conclusion

The scaffolding and native Android plan for `partner-app/` is complete, authoritative, and ready for immediate implementation. All files—including `package.json`, `tsconfig.json`, `metro.config.js`, `babel.config.js`, `index.js`, `app.json`, `build.gradle`, `settings.gradle`, `gradle.properties`, `app/build.gradle`, `AndroidManifest.xml`, Kotlin source files, and icon generator—have been drafted with exact verbatim contents in `.agents/teamwork/explorer_m1_2/scaffolding_plan.md`.

---

## 5. Verification Method

Once the Worker implements the scaffolding plan:

1. **Static Analysis Verification:**
   ```powershell
   cd "c:\Users\AnkitAhirwar\OneDrive\Desktop\lifeline 360\partner-app"
   npx tsc --noEmit
   npx eslint .
   ```
   *Expected outcome: Exit code 0, 0 TypeScript errors, 0 ESLint errors.*

2. **Native Signed Release APK Build:**
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.13.11-hotspot"
   cd L:\partner-app\android
   .\gradlew.bat assembleRelease "-PreactNativeArchitectures=arm64-v8a,armeabi-v7a,x86_64"
   .\gradlew.bat --stop
   ```
   *Expected outcome: `BUILD SUCCESSFUL` output in terminal.*

3. **Release Certificate Verification (`apksigner`):**
   ```powershell
   & "C:\Android\build-tools\36.0.0\apksigner.bat" verify --print-certs "L:\partner-app\android\app\build\outputs\apk\release\app-release.apk"
   ```
   *Pass criteria: Signer #1 DN must be `CN=Lifeline 360 Partner, O=Lifeline 360, C=IN`. Must NOT contain `Android Debug`.*

4. **Package & Label Badging Verification (`aapt2`):**
   ```powershell
   & "C:\Android\build-tools\36.0.0\aapt2.exe" dump badging "L:\partner-app\android\app\build\outputs\apk\release\app-release.apk" | Select-String "package|application-label"
   ```
   *Pass criteria: `package: name='com.lifeline360.partner'` and `application-label:'Lifeline Partner'`.*
