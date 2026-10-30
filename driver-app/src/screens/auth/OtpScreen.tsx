import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyRound, ShieldAlert } from 'lucide-react-native';
import { AppBar, Button, Card, Field } from '../../components/ui';
import T from '../../components/T';
import { colors } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function OtpScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { verifyOtp, session } = useDriverStore();
  const phone = route.params?.phone || '9876543210';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (code.length < 6) {
      setError('Enter 6-digit verification code');
      return;
    }
    verifyOtp(code);
    const next = !session.isOnboarded ? 'DriverDetails' : session.kycStatus !== 'approved' ? 'KycPending' : 'MainTabs';
    nav.reset({ index: 0, routes: [{ name: next }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Verify Phone" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={22} style={{ marginBottom: 6 }}>
          Enter OTP Code
        </T>
        <T size={14} color={colors.muted} style={{ marginBottom: 24 }}>
          We sent a 6-digit verification code to +91 {phone}.
        </T>

        <Field
          label="Verification Code"
          placeholder="6-digit OTP"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(t) => {
            setCode(t);
            setError('');
          }}
          error={error}
        />

        <View style={{ height: 12 }} />
        <Button title="Verify & Proceed" onPress={handleVerify} />

        <View style={{ marginTop: 28 }}>
          <Card style={{ backgroundColor: colors.surface2, borderColor: colors.lineStrong }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <KeyRound size={16} color={colors.teal} />
              <T w="bold" size={13}>
                Demo Mode Notice
              </T>
            </View>
            <T size={12} color={colors.muted} lh={18}>
              Any 6-digit code is accepted during demo builds. Press Verify to proceed.
            </T>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

