import React, { useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Clock, CheckCircle2, ShieldCheck, PhoneCall } from 'lucide-react-native';
import { AppBar, Button, Card } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function KycPendingScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { session, approveKyc } = useDriverStore();

  const handleInstantApprove = () => {
    approveKyc();
    nav.replace('WelcomeApproved');
  };

  // Demo: stands in for the Master Admin approving the documents.
  useEffect(() => {
    if (session.kycStatus === 'approved') return;
    const t = setTimeout(() => {
      approveKyc();
      nav.replace('WelcomeApproved');
    }, 6000);
    return () => clearTimeout(t);
    // Only the status should restart the timer; the store's functions change every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.kycStatus]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="KYC Status" onBack={() => nav.navigate('DocumentList')} />
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', paddingBottom: safeBottom + 24 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.amberSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            marginBottom: 20,
          }}>
          <Clock size={42} color={colors.amber} />
        </View>

        <T w="extrabold" size={22} center style={{ marginBottom: 8 }}>
          Verification in Progress
        </T>
        <T size={14} color={colors.muted} center lh={22} style={{ marginBottom: 28 }}>
          Your driving licence and commercial ambulance documents have been submitted to Lifeline Dispatch Operations.
        </T>

        <Card style={{ width: '100%', backgroundColor: colors.surface2, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <ShieldCheck size={18} color={colors.teal} />
            <T w="bold" size={14}>
              What happens next?
            </T>
          </View>
          <T size={12} color={colors.muted} lh={18}>
            1. Fleet team verifies RTO credentials and chassis number.{'\n'}
            2. Medical equipment checklist confirmed.{'\n'}
            3. Account activated for receiving live emergency calls.
          </T>
        </Card>

        {/* Demo trigger */}
        <Button
          title="Demo Mode: Activate Account Now"
          variant="primary"
          icon={<CheckCircle2 size={18} color={colors.white} />}
          onPress={handleInstantApprove}
          style={{ width: '100%', marginBottom: 12 }}
        />

        <Button
          title="Call Dispatch Support (1800-360-911)"
          variant="outline"
          icon={<PhoneCall size={18} color={colors.teal} />}
          onPress={() => nav.navigate('MaskedCall', { name: 'Lifeline Dispatch', role: 'Driver support · 24/7' })}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

