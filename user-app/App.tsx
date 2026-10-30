/**
 * Lifeline 360 — User app.
 *
 * Demo build: every flow runs on local sample data (src/data) and device
 * storage (src/store) until the backend APIs are connected.
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStoreProvider } from './src/store/AppStore';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppStoreProvider>
        <RootNavigator />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
