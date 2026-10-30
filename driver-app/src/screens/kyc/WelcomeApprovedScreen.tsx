import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, ShieldCheck, Ambulance, ArrowRight } from 'lucide-react-native';
import { Button, Card } from '../../components/ui';
import { LifelineMark } from '../../components/brand';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function WelcomeApprovedScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { profile } = useDriverStore();

  const handleStartDuty = () => {
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', justifyContent: 'center', flexGrow: 1, paddingBottom: safeBottom + 24 }}>
        <LifelineMark size={64} />
        <View style={{ height: 20 }} />

        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.greenSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
          <CheckCircle2 size={44} color={colors.green} />
        </View>

        <T w="extrabold" size={24} center style={{ marginBottom: 6 }}>
          You're Ready to Roll!
        </T>
        <T size={14} color={colors.muted} center style={{ marginBottom: 24 }}>
          Welcome, {profile.name}! Your {profile.vehicleType} Ambulance ({profile.vehiclePlate}) is active on the network.
        </T>

        <Card style={{ width: '100%', backgroundColor: colors.tealTint, borderColor: colors.tealLine, marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Ambulance size={20} color={colors.teal} />
            <T w="bold" size={15} color={colors.tealDark}>
              Duty Protocol
            </T>
          </View>
          <T size={12} color={colors.tealDeep} lh={18}>
            • Keep app online during your shift.{'\n'}
            • You have 30 seconds to accept incoming emergency calls.{'\n'}
            • Fast response saves lives. Emergency corridors are coordinated.
          </T>
        </Card>

        <Button
          title="Start Ambulance Shift"
          variant="primary"
          icon={<ArrowRight size={18} color={colors.white} />}
          onPress={handleStartDuty}
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

