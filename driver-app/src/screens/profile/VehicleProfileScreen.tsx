import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ambulance, Check, Wrench, ShieldCheck, HeartPulse } from 'lucide-react-native';
import { AppBar, Card } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function VehicleProfileScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { profile } = useDriverStore();

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Vehicle Specifications" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          {profile.vehicleType} Ambulance Specification
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
          Assigned emergency transport unit registered under Lifeline 360 network.
        </T>

        <Card style={{ backgroundColor: colors.surface2, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Registration Plate
            </T>
            <T w="bold" size={13}>
              {profile.vehiclePlate}
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Make & Model
            </T>
            <T w="bold" size={13}>
              {profile.vehicleModel}
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Classification
            </T>
            <T w="bold" size={13} color={colors.teal}>
              Advanced Life Support (ALS)
            </T>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
            <T size={13} color={colors.muted}>
              Fitness Expiry
            </T>
            <T w="bold" size={13}>
              22 Dec 2030
            </T>
          </View>
        </Card>

        <T w="extrabold" size={16} style={{ marginBottom: 12 }}>
          On-Board Certified Medical Equipment
        </T>
        {profile.equipment.map((item, idx) => (
          <View
            key={idx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 14,
              backgroundColor: colors.white,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.line,
              marginBottom: 8,
              gap: 10,
            }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.greenSoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Check size={16} color={colors.green} />
            </View>
            <T w="semibold" size={14} color={colors.ink} style={{ flex: 1 }}>
              {item}
            </T>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

