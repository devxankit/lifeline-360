import React from 'react';
import { View, ScrollView, Alert, Linking, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ShieldAlert, PhoneCall, Radio, AlertOctagon, HelpCircle } from 'lucide-react-native';
import { AppBar, Card, Button } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';

export default function SosControlScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();

  const handleCallSOS = () => {
    Linking.openURL('tel:1800360911').catch(() => {
      Alert.alert('Emergency Dispatch Hotline', 'Call 1800-360-911 for Lifeline 360 Control Room assistance.');
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="SOS Control Room" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.redSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}>
            <ShieldAlert size={44} color={colors.red} />
          </View>
          <T w="extrabold" size={22} color={colors.redText}>
            Emergency SOS Hotline
          </T>
          <T size={13} color={colors.muted} center style={{ marginTop: 4 }}>
            Direct priority dispatch link to Central Emergency Operations Command.
          </T>
        </View>

        <Card style={{ backgroundColor: colors.surface2, borderColor: colors.lineStrong, marginBottom: 20 }}>
          <T w="bold" size={14} style={{ marginBottom: 6 }}>
            When to trigger an SOS:
          </T>
          <T size={12} color={colors.muted} lh={18}>
            • Ambulance mechanical breakdown or accident while transporting a patient.{'\n'}
            • Road rage, security incident, or violent encounter.{'\n'}
            • Urgent hospital triage diversion requested.{'\n'}
            • Critical equipment failure (ventilator / defibrillator failure).
          </T>
        </Card>

        <Button
          title="CALL CONTROL ROOM (1800-360-911)"
          variant="danger"
          size="lg"
          icon={<PhoneCall size={20} color={colors.white} />}
          onPress={handleCallSOS}
          style={{ width: '100%', height: 56, marginBottom: 12 }}
        />

        <Button
          title="Return to Console"
          variant="outline"
          onPress={() => nav.goBack()}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

