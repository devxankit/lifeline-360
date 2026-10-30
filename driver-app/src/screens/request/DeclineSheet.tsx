import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBar, Button } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function DeclineSheet() {
  const nav = useNavigation<any>();
  const { declineRequest } = useDriverStore();
  const insets = useSafeAreaInsets();
  const reasons = [
    'Traffic Congestion / Road blocked',
    'Emergency vehicle maintenance required',
    'Ambulance equipment check in progress',
    'Shift ending / Refueling',
    'Patient pickup location inaccessible',
  ];
  const [selected, setSelected] = useState(reasons[0]);

  const handleConfirmDecline = () => {
    declineRequest(selected);
    nav.popToTop();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="Decline Request" />
      <View style={{ flex: 1, padding: 20, paddingBottom: insets.bottom + 16, justifyContent: 'space-between' }}>
        <View>
          <T w="extrabold" size={18} style={{ marginBottom: 6 }}>
            Select Decline Reason
          </T>
          <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
            Dispatch will immediately reassign this call to the nearest available unit.
          </T>

          {reasons.map((r) => {
            const active = selected === r;
            return (
              <Pressable
                key={r}
                onPress={() => setSelected(r)}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: radius.md,
                  borderWidth: 1.5,
                  borderColor: active ? colors.red : colors.lineStrong,
                  backgroundColor: active ? colors.redSoft : colors.surface2,
                  marginBottom: 10,
                }}>
                <T w={active ? 'bold' : 'medium'} size={14} color={active ? colors.redText : colors.ink}>
                  {r}
                </T>
              </Pressable>
            );
          })}
        </View>

        <Button
          title="Confirm Decline & Return to Home"
          variant="danger"
          onPress={handleConfirmDecline}
        />
      </View>
    </View>
  );
}

