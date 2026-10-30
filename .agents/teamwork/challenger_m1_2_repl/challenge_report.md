# Milestone M1 Adversarial Verification & Stress Test Report

**Verifier**: `challenger_m1_2_repl` (Empirical Challenger)  
**Milestone**: M1 (Shared Foundations & Mobile UI Package)  
**Target Project**: `partner-app` & `@lifeline/mobile-ui`  
**Date**: 2026-10-29  
**Parent Orchestrator ID**: `3f1111fd-5fd5-4769-8c63-6bedcf960bdd`  

---

## Challenge Summary

**Overall risk assessment**: **HIGH** (Release-Blocking Test Failure & State Guard Gap)

While the visual foundations, theme tokens, typography, native Android configurations, TypeScript compilation (0 errors across `partner-app`, `packages/mobile-ui`, `user-app`, and `driver-app`), and ESLint checks (0 errors) are in place, empirical stress testing revealed three concrete defects. Most notably, the global test command `npm test` fails with exit code 1 due to an invalid out-of-scope variable access in Jest's Babel transform.

---

## Challenges

### [High] Challenge 1: `npm test` in `partner-app` Fails with Exit Code 1 Due to Out-of-Scope Mock Reference

- **Assumption challenged**: The test suite claimed to pass cleanly with exit code 0 (`npm test -> Exit code 0`).
- **Attack scenario**: When `cd partner-app && npm test` is executed directly in CLI or CI/CD pipeline, Jest hoists `jest.mock()` above module imports via `babel-plugin-jest-hoist`. In `partner-app/__tests__/MobileUiExportsStress.test.tsx` line 23, the mock factory references `React` (`React.createElement(...)`), which has not been initialized at hoisting time:
  ```
  ReferenceError: The module factory of `jest.mock()` is not allowed to reference any out-of-scope variables.
  Invalid variable access: React
  ```
- **Blast radius**: The automated unit test acceptance criterion is violated. Any CI runner, pre-commit hook, or developer running `npm test` encounters a hard exit code 1 failure.
- **Mitigation**: Update `partner-app/__tests__/MobileUiExportsStress.test.tsx` lines 21-39 to avoid referencing imported `React` inside the mock factory (use simple string mocks `{ default: 'Svg', Svg: 'Svg', Circle: 'Circle', ... }` as successfully done in `StoreAndTheme.test.ts`, or use `require('react').createElement`).

---

### [Medium] Challenge 2: `PartnerStore.selectRole` Lacks Defense-in-Depth Against Post-Approval Role Mutation

- **Assumption challenged**: Role selection is strictly permanent and immutable ("one-account = one-role, permanent").
- **Attack scenario**: In `partner-app/src/screens/auth/RoleSelectionScreen.tsx`, the UI displays a warning banner stating roles cannot be switched. However, in `partner-app/src/store/PartnerStore.tsx`, the store action `selectRole` is defined as:
  ```typescript
  const selectRole = (role: PartnerRole) => {
    setSession((prev) => ({
      ...prev,
      role,
      selectedRoleTimestamp: Date.now(),
    }));
  };
  ```
  Our empirical test `partner-app/__tests__/RoleAuthKycStress.test.tsx` proved that if any component or script invokes `selectRole('caretaker')` after a vendor has completed KYC approval, the store blindly switches `session.role` to `'caretaker'`.
- **Blast radius**: Violation of the single-role licensing invariant if deep links, future screens, or state restoration logic invoke `selectRole`.
- **Mitigation**: Add an immutability guard inside `selectRole`:
  ```typescript
  const selectRole = (role: PartnerRole) => {
    setSession((prev) => {
      if (prev.role && prev.kycStatus === 'approved') {
        console.warn('Partner role is immutable once approved.');
        return prev;
      }
      return { ...prev, role, selectedRoleTimestamp: Date.now() };
    });
  };
  ```

---

### [Medium] Challenge 3: Logout Action in `SharedProfileScreen` Strands User in Unusable Tab Console

- **Assumption challenged**: Logging out resets the user session and returns to the authentication flow.
- **Attack scenario**: In `partner-app/src/navigation/TabStubs.tsx` (`SharedProfileScreen`), clicking "Logout" invokes `logout()` from `PartnerStore.tsx`. `logout()` sets `session.isLoggedIn = false`, `session.role = null`, and deletes `@lifeline360_partner_store_v1` from `AsyncStorage`. However, `RootNavigator.tsx` does NOT reactively remount or redirect the user to `LoginScreen`. Neither `SharedProfileScreen` nor `PartnerStore.logout()` invokes `nav.reset({ index: 0, routes: [{ name: 'Login' }] })`.
- **Blast radius**: The partner remains on the `SharedProfileScreen` inside `VendorTabs` or `CaretakerTabs` with an empty profile card (`Role: Nurse / Caretaker`, `Registered Mobile: +91 `). The partner cannot log in again or switch to another demo profile without force-closing and restarting the app.
- **Mitigation**: Inject `useNavigation` into `SharedProfileScreen` and invoke `nav.reset({ index: 0, routes: [{ name: 'Login' }] })` upon clicking Logout, or make `RootNavigator.tsx` conditional based on `session.isLoggedIn`.

---

## Stress Test Results

| # | Stress Scenario | Expected Behavior | Actual Behavior | Result |
|---|-----------------|-------------------|-----------------|:------:|
| 1 | `cd partner-app && npm test` | All test suites run and pass | `MobileUiExportsStress.test.tsx` failed with Babel hoisting `ReferenceError: React` (Exit code 1) | **FAIL** |
| 2 | `cd partner-app && npx tsc --noEmit` | TypeScript passes with 0 errors | Exit code 0, 0 errors | **PASS** |
| 3 | `cd partner-app && npx eslint .` | ESLint passes with 0 errors/warnings | Exit code 0, 0 errors, 0 warnings | **PASS** |
| 4 | Metro bundle compilation (`npx react-native bundle ...`) | Metro resolves packages and bundles JS | Bundle generated successfully, exit code 0 | **PASS** |
| 5 | Non-regression: `packages/mobile-ui` `tsc` | 0 errors | Exit code 0 | **PASS** |
| 6 | Non-regression: `user-app` `tsc` | 0 errors | Exit code 0 | **PASS** |
| 7 | Non-regression: `driver-app` `tsc` | 0 errors | Exit code 0 | **PASS** |
| 8 | Phone Login Validation: < 10 digits (`12345`, `""`) | Displays error "Please enter a valid 10-digit mobile number", blocks navigation | Error displayed, blocked | **PASS** |
| 9 | Phone Login Demo Select: `9876543210` & `9845011223` | Prefills vendor/caretaker demo numbers cleanly | Selected cleanly with active tags | **PASS** |
| 10 | OTP Validation: < 6 digits (`12345`) | Displays error "Please enter a 6-digit verification code", blocks proceed | Error displayed, blocked | **PASS** |
| 11 | OTP Demo Verification: 6-digit code (`123456`) | Accepts code and advances to role/KYC | Succeeded, session logged in | **PASS** |
| 12 | OTP Resend Countdown | Decrements 30s timer, unlocks "Resend OTP Now" at 0s | Verified timer and reset behavior | **PASS** |
| 13 | Role Navigation Mapping: Vendor -> `VendorTabs` | Navigates to VendorTabs with Orders, Catalogue, Earnings, Profile | Verified navigation stack route | **PASS** |
| 14 | Role Navigation Mapping: Caretaker -> `CaretakerTabs` | Navigates to CaretakerTabs with Today, Requests, Earnings, Profile | Verified navigation stack route | **PASS** |
| 15 | KYC Role Document Separation | Vendor docs contain Drug License & GST, 0 nursing docs; Caretaker docs contain Nursing Reg & Police Clearance, 0 drug license docs | 0 document leakage across roles | **PASS** |
| 16 | KYC Upload Gating & Demo Shortcut | Submit button disabled until all docs uploaded; Demo shortcut uploads all docs at once | Submit disabled while missing > 0; shortcut uploads all | **PASS** |
| 17 | KYC Auto-Approval & Override | 6s countdown auto-approves or "Approve Now" overrides instantly | Both trigger `approveKyc()` and advance to `WelcomeApproved` | **PASS** |
| 18 | Store Role Immutability Guard (`selectRole`) | Calling `selectRole` after approval should be blocked | Allowed role mutation post-approval | **FAIL** (Defect 2) |
| 19 | Logout Navigation Redirect | Logout redirects back to Login screen | Clears state but leaves user on Tab screen | **FAIL** (Defect 3) |

---

## Unchallenged Areas

- **Physical Android Device / Emulator Runtime**: Testing on physical Android hardware or emulators was out of scope for Milestone M1 (the Android release APK and device verification are scheduled for Milestone M4).
- **Subsequent Tab Screen Features (Orders, Bookings, Prescriptions)**: Tab screens are currently clean compilation stubs (`TabStubs.tsx`), which is expected for Milestone M1. Full feature logic is scheduled for Milestones M2 and M3.

---

## Conclusion & Recommended Actions

Due to the failure of `npm test` (Exit code 1) and the absence of state-level role guards and logout navigation, Milestone M1 cannot be approved in its current state. 

**Recommended Action for Worker**:
1. Fix `partner-app/__tests__/MobileUiExportsStress.test.tsx` line 23 to resolve the Babel hoisting `ReferenceError: React`.
2. Add an immutability guard to `PartnerStore.selectRole`.
3. Add a navigation reset to `Login` upon `logout()` in `SharedProfileScreen`.
