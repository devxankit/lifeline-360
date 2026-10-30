import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Phone, ShieldCheck, Ambulance } from 'lucide-react-native';
import { LifelineMark, Wordmark } from '../../components/brand';
import T from '../../components/T';
import { Button, Card, Field } from '../../components/ui';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function PhoneLoginScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { loginPhone } = useDriverStore();
  const [phone, setPhone] = useState('9876543210');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    loginPhone(clean);
    nav.navigate('OtpVerification', { phone: clean });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 24, paddingHorizontal: 20 }}>
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <LifelineMark size={52} />
          <View style={{ height: 10 }} />
          <Wordmark size={20} />
          <T size={13} color={colors.muted} style={{ marginTop: 4 }}>
            Emergency Driver Partner Network
          </T>
        </View>

        <T w="extrabold" size={24} style={{ marginBottom: 6 }}>
          Partner Login
        </T>
        <T size={14} color={colors.muted} style={{ marginBottom: 24 }}>
          Enter your registered mobile number to receive dispatch calls and manage your ambulance trips.
        </T>

        <Field
          label="Mobile Number"
          placeholder="Enter 10-digit number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            setError('');
          }}
          error={error}
          left={
            <View style={{ paddingRight: 10, borderRightWidth: 1, borderRightColor: colors.line }}>
              <T w="bold" size={15}>
                +91
              </T>
            </View>
          }
        />

        <View style={{ height: 12 }} />
        <Button title="Get OTP" onPress={handleContinue} />

        <View style={{ marginTop: 28 }}>
          <Card style={{ backgroundColor: colors.surface2, borderColor: colors.lineStrong }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <ShieldCheck size={18} color={colors.teal} />
              <T w="bold" size={13} color={colors.ink}>
                Demo Account Pre-filled
              </T>
            </View>
            <T size={12} color={colors.muted} lh={18}>
              For testing: Use pre-filled mobile 9876543210. Any 6-digit OTP works to enter the driver console.
            </T>
          </Card>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: insets.bottom + 20, marginTop: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ambulance size={16} color={colors.muted} />
            <T size={12} color={colors.muted}>
              Need fleet support? Contact 1800-360-911
            </T>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

