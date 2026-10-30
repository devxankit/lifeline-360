import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LifelineMark, Wordmark } from '../../components/brand';
import T from '../../components/T';
import { colors } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function SplashScreen() {
  const nav = useNavigation<any>();
  const { session, hydrated } = useDriverStore();

  useEffect(() => {
    if (!hydrated) return;
    const timer = setTimeout(() => {
      if (!session.isLoggedIn) nav.replace('PhoneLogin');
      else if (!session.isOnboarded) nav.replace('DriverDetails');
      else if (session.kycStatus !== 'approved') nav.replace('KycPending');
      else nav.replace('MainTabs');
    }, 1200);
    return () => clearTimeout(timer);
  }, [hydrated, session, nav]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <LifelineMark size={72} />
        <View style={{ height: 16 }} />
        <Wordmark size={24} light />
        <View style={{ height: 8 }} />
        <T size={13} color={colors.navyMuted} w="semibold">
          Emergency Ambulance Fleet Partner
        </T>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator color={colors.teal} size="small" />
        <T size={11} color={colors.navyMuted} style={{ marginTop: 10 }}>
          Version 1.0.0 · Demo Mode
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    justifyContent: 'space-between',
    paddingVertical: 50,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
  },
});

