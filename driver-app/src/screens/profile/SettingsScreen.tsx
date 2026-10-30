import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { AppBar, Card } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';

export default function SettingsScreen() {
  const { bottom: safeBottom } = useSafeAreaInsets();
  const [loudAlarm, setLoudAlarm] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [autoNav, setAutoNav] = useState(true);
  const [nightModeAuto, setNightModeAuto] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title="App Settings" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: safeBottom + 24 }}>
        <T w="extrabold" size={20} style={{ marginBottom: 4 }}>
          Emergency Alert Preferences
        </T>
        <T size={13} color={colors.muted} style={{ marginBottom: 20 }}>
          Configure sirens, vibration, and hands-free driving utilities.
        </T>

        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <T w="bold" size={14}>
                Loud Emergency Ringtone
              </T>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                High-priority siren sound for incoming dispatch calls
              </T>
            </View>
            <Switch
              value={loudAlarm}
              onValueChange={setLoudAlarm}
              trackColor={{ false: colors.lineStrong, true: colors.teal }}
            />
          </View>

          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <T w="bold" size={14}>
                Vibration Alert
              </T>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                Pulsing vibration during the 30-second countdown
              </T>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: colors.lineStrong, true: colors.teal }}
            />
          </View>
        </Card>

        <T w="extrabold" size={16} style={{ marginBottom: 12 }}>
          Driving & Navigation
        </T>
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <T w="bold" size={14}>
                Auto High-Contrast Night Mode
              </T>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                Switch to dark navy theme during active driving trips to reduce glare
              </T>
            </View>
            <Switch
              value={nightModeAuto}
              onValueChange={setNightModeAuto}
              trackColor={{ false: colors.lineStrong, true: colors.teal }}
            />
          </View>

          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <T w="bold" size={14}>
                Turn-by-Turn Deep Link
              </T>
              <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
                One-tap quick handoff to Google Maps Navigation app
              </T>
            </View>
            <Switch
              value={autoNav}
              onValueChange={setAutoNav}
              trackColor={{ false: colors.lineStrong, true: colors.teal }}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

