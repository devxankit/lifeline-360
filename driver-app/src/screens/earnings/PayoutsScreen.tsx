import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Building, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react-native';
import { AppBar, Card, Button } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { rupees } from '../../utils/format';

export default function PayoutsScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();

  const handleInstantPayout = () => {
    Alert.alert('Instant Payout Initiated', '₹4,850 will be credited to HDFC Bank (••••4012) via IMPS within 15 minutes.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Bank & Payouts" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          Linked Bank Account
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
          Direct weekly IMPS/NEFT transfers are deposited to this account.
        </T>

        <Card style={{ backgroundColor: colors.surface2, borderColor: colors.lineStrong, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.tealSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Building size={22} color={colors.teal} />
            </View>
            <View>
              <T w="bold" size={15}>
                HDFC Bank Ltd.
              </T>
              <T size={12} color={colors.muted}>
                IFSC: HDFC0001208 · Savings
              </T>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: colors.lineStrong, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Account Holder
            </T>
            <T w="bold" size={13}>
              RAJESH KUMAR
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Account Number
            </T>
            <T w="bold" size={13}>
              50100492814012
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Verification Status
            </T>
            <T w="bold" size={13} color={colors.greenText}>
              Penny-drop Verified ✓
            </T>
          </View>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <T w="bold" size={14} style={{ marginBottom: 4 }}>
            Instant Payout Available
          </T>
          <T size={12} color={colors.muted} style={{ marginBottom: 12 }}>
            Withdraw current settled balance instantly without waiting for the weekly Tuesday cycle.
          </T>
          <Button
            title="Request Instant Payout (₹4,850)"
            variant="primary"
            onPress={handleInstantPayout}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

