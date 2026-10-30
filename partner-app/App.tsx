/**
 * Lifeline 360 Partner: one app for medicine vendors and nurses/caretakers.
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PartnerStoreProvider } from './src/store/PartnerStore';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PartnerStoreProvider>
        <RootNavigator />
      </PartnerStoreProvider>
    </SafeAreaProvider>
  );
}
