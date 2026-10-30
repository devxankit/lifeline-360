import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ambulance, Check, Wrench } from 'lucide-react-native';
import { AppBar, Button, Card, Field } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function VehicleDetailsScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { profile, updateProfile } = useDriverStore();

  const [vehicleType, setVehicleType] = useState<any>(profile.vehicleType);
  const [plate, setPlate] = useState(profile.vehiclePlate);
  const [model, setModel] = useState(profile.vehicleModel);

  const types = [
    { key: 'ALS', title: 'Advanced Life Support (ALS)', desc: 'With Ventilator & Defibrillator' },
    { key: 'BLS', title: 'Basic Life Support (BLS)', desc: 'Oxygen & Standard Stretcher' },
    { key: 'ICU', title: 'ICU on Wheels', desc: 'Critical Care Monitoring & Infusion' },
  ];

  const handleNext = () => {
    updateProfile({
      vehicleType,
      vehiclePlate: plate,
      vehicleModel: model,
    });
    nav.navigate('DocumentList');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Ambulance Details (Step 2/3)" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          Vehicle Information
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
          Specify your ambulance classification and registration specifications.
        </T>

        <T w="semibold" size={13} color={colors.ink2} style={{ marginBottom: 8 }}>
          Vehicle Classification
        </T>
        {types.map((t) => {
          const active = vehicleType === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setVehicleType(t.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderRadius: radius.md,
                borderWidth: 1.5,
                borderColor: active ? colors.teal : colors.lineStrong,
                backgroundColor: active ? colors.tealTint : colors.surface2,
                marginBottom: 10,
              }}>
              <View style={{ flex: 1 }}>
                <T w="bold" size={15} color={active ? colors.tealDark : colors.ink}>
                  {t.title}
                </T>
                <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                  {t.desc}
                </T>
              </View>
              {active ? <Check size={20} color={colors.teal} /> : null}
            </Pressable>
          );
        })}

        <View style={{ height: 12 }} />
        <Field label="Registration Plate Number" value={plate} onChangeText={setPlate} autoCapitalize="characters" />
        <Field label="Vehicle Make & Model" value={model} onChangeText={setModel} />

        <View style={{ height: 16 }} />
        <Button title="Continue to KYC Documents" onPress={handleNext} />
      </ScrollView>
    </View>
  );
}

