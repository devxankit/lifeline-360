/**
 * Lifeline 360 — Driver / Ambulance App.
 *
 * Standalone release build: Full emergency dispatch loop, live turn-by-turn routing,
 * shift metrics, earnings tracking, and offline/online standby.
 */
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DriverStoreProvider } from './src/store/DriverStore';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <DriverStoreProvider>
        <RootNavigator />
      </DriverStoreProvider>
    </SafeAreaProvider>
  );
}
