import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldCheck, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react-native';
import T from '../../components/T';
import { Avatar } from '../../components/ui';
import { colors } from '../../theme';

export default function MaskedCallModal() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { name = 'Patient Attendant', role = 'Family Contact' } = route.params || {};

  const [secs, setSecs] = useState(0);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    const c = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(c);
  }, []);

  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 30 }]}>

      {/* Security pill */}
      <View style={styles.securePill}>
        <ShieldCheck size={14} color="#7FD3C7" />
        <T w="semibold" size={12} color="#AEE3DA">
          Lifeline Secure Masked Line · Phone numbers hidden
        </T>
      </View>

      {/* Contact info */}
      <View style={{ marginTop: 40, alignItems: 'center', gap: 10 }}>
        <Avatar name={name} size={100} />
        <T w="extrabold" size={22} color={colors.white}>
          {name}
        </T>
        <T size={14} color="#AEE3DA">
          {role}
        </T>
        <T w="semibold" size={16} color={colors.white} style={{ marginTop: 8 }}>
          {connected ? `${mm}:${ss}` : 'Connecting call…'}
        </T>
      </View>

      <View style={{ flex: 1 }} />

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
        <CallBtn label={muted ? 'Unmute' : 'Mute'} on={muted} onPress={() => setMuted((m) => !m)}>
          {muted ? <MicOff size={24} color={colors.tealDeep} /> : <Mic size={24} color={colors.white} />}
        </CallBtn>

        <Pressable
          onPress={() => nav.goBack()}
          accessibilityLabel="End call"
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.red,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PhoneOff size={28} color={colors.white} />
        </Pressable>

        <CallBtn label="Speaker" on={speaker} onPress={() => setSpeaker((m) => !m)}>
          <Volume2 size={24} color={speaker ? colors.tealDeep : colors.white} />
        </CallBtn>
      </View>
    </View>
  );
}

function CallBtn({
  children,
  label,
  on,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  on: boolean;
  onPress: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <Pressable
        onPress={onPress}
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: on ? colors.white : 'rgba(255,255,255,0.14)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {children}
      </Pressable>
      <T size={12} color="#AEE3DA">
        {label}
      </T>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
  },
  securePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});

