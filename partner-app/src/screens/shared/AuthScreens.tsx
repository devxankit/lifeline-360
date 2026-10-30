import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, HeartPulse, Pill } from 'lucide-react-native';
import { AppBar, Button, Field, LifelineMark, T, Wordmark, colors, radius, service } from '../../ui';
import { usePartnerStore } from '../../store/PartnerStore';
import { PartnerRole } from '../../store/types';
import { homeRouteFor } from '../../navigation/routes';
import { OtpBoxes } from '../../components/partner';

/* ------------------------------------------------------------------ Splash */

export function SplashScreen() {
  const nav = useNavigation<any>();
  const { hydrated, session } = usePartnerStore();

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => nav.reset({ index: 0, routes: [{ name: homeRouteFor(session) }] }), 900);
    return () => clearTimeout(t);
    // Route once, with the session as it was loaded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
      <LifelineMark size={76} />
      <View style={{ height: 16 }} />
      <Wordmark size={26} light />
      <T size={14} color="#AEB4C8" w="semibold" style={{ marginTop: 8 }}>
        Partner
      </T>
      <T size={11} color="#7D849E" style={{ position: 'absolute', bottom: 40 }}>
        For pharmacies, nurses and caretakers
      </T>
    </View>
  );
}

/* ------------------------------------------------------------------- Login */

const DEMO_ACCOUNTS = [
  { phone: '9876543210', label: 'Pharmacy', Icon: Pill, tint: service.medicine },
  { phone: '9845011223', label: 'Caretaker', Icon: HeartPulse, tint: service.nursing },
];

export function LoginScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { dispatch } = usePartnerStore();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const clean = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(clean)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    dispatch({ type: 'LOGIN_PHONE', phone: clean });
    nav.navigate('Otp', { phone: clean });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 32, paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LifelineMark size={40} />
          <View>
            <Wordmark size={18} />
            <T size={12} color={colors.muted} w="semibold">
              Partner
            </T>
          </View>
        </View>

        <T w="extrabold" size={26} style={{ marginTop: 36 }}>
          Log in or sign up
        </T>
        <T size={14} color={colors.muted} lh={21} style={{ marginTop: 6, marginBottom: 24 }}>
          For pharmacies and home-care nurses working with Lifeline 360.
        </T>

        <Field
          label="Mobile number"
          placeholder="10-digit number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(t) => {
            setPhone(t.replace(/\D/g, ''));
            setError('');
          }}
          onSubmitEditing={submit}
          error={error}
          left={
            <View style={{ paddingRight: 10, borderRightWidth: 1, borderRightColor: colors.line }}>
              <T w="bold" size={15}>
                +91
              </T>
            </View>
          }
        />
        <Button title="Get OTP" onPress={submit} style={{ marginTop: 16 }} disabled={phone.length < 10} />

        <View style={{ marginTop: 28 }}>
          <T size={12} color={colors.muted} w="semibold" style={{ marginBottom: 8 }}>
            Demo accounts
          </T>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {DEMO_ACCOUNTS.map((a) => (
              <Pressable
                key={a.phone}
                onPress={() => {
                  setPhone(a.phone);
                  setError('');
                }}
                style={({ pressed }) => [styles.demo, { borderColor: phone === a.phone ? a.tint.fg : colors.line, opacity: pressed ? 0.8 : 1 }]}>
                <View style={[styles.demoIcon, { backgroundColor: a.tint.bg }]}>
                  <a.Icon size={16} color={a.tint.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <T w="bold" size={13}>
                    {a.label}
                  </T>
                  <T size={11.5} color={colors.muted}>
                    {a.phone.slice(0, 5)} {a.phone.slice(5)}
                  </T>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 32 }}>
          <T size={11.5} color={colors.muted} center lh={17}>
            By continuing you agree to the Partner Terms and Privacy Policy.
          </T>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* --------------------------------------------------------------------- OTP */

export function OtpScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { session, dispatch } = usePartnerStore();
  const phone: string = route.params?.phone ?? session.phone;
  const [otp, setOtp] = useState('');
  const [wait, setWait] = useState(30);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = (code: string) => {
    if (code.length < 6) return;
    dispatch({ type: 'VERIFY_OTP' });
    nav.reset({ index: 0, routes: [{ name: homeRouteFor({ ...session, isLoggedIn: true }) }] });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar border={false} />
      <View style={{ paddingHorizontal: 20 }}>
        <T w="extrabold" size={24}>
          Enter the code
        </T>
        <T size={14} color={colors.muted} lh={21} style={{ marginTop: 6, marginBottom: 28 }}>
          Sent by SMS to +91 {phone.slice(0, 5)} {phone.slice(5)}.{' '}
          <T w="bold" size={14} color={colors.teal} onPress={() => nav.goBack()}>
            Change
          </T>
        </T>
        <OtpBoxes
          length={6}
          value={otp}
          onChange={(v) => {
            setOtp(v);
            if (v.length === 6) verify(v);
          }}
        />
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          {wait > 0 ? (
            <T size={13} color={colors.muted}>
              Resend code in 0:{wait < 10 ? `0${wait}` : wait}
            </T>
          ) : (
            <T w="bold" size={13} color={colors.teal} onPress={() => setWait(30)}>
              Resend code
            </T>
          )}
        </View>
        <T size={12} color={colors.faint} center style={{ marginTop: 28 }}>
          Demo build: any 6 digits work
        </T>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------- Role choice */

const ROLES: { key: PartnerRole; title: string; text: string; points: string[]; Icon: typeof Pill; tint: typeof service.medicine }[] = [
  {
    key: 'vendor',
    title: 'Medicine vendor',
    text: 'Licensed pharmacy or chemist',
    points: ['Receive medicine and prescription orders', 'Manage your catalogue, prices and stock', 'Hand orders to Lifeline riders'],
    Icon: Pill,
    tint: service.medicine,
  },
  {
    key: 'caretaker',
    title: 'Nurse or caretaker',
    text: 'GNM / ANM / BSc nurse or trained caregiver',
    points: ['Get home-care booking requests near you', 'Set your weekly availability and rates', 'Check in, track care tasks, get paid weekly'],
    Icon: HeartPulse,
    tint: service.nursing,
  },
];

export function RoleSelectionScreen() {
  const nav = useNavigation<any>();
  const { session, dispatch } = usePartnerStore();
  const [role, setRole] = useState<PartnerRole>(session.role ?? (session.phone === '9845011223' ? 'caretaker' : 'vendor'));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="How will you work with us?" onBack={() => nav.reset({ index: 0, routes: [{ name: 'Login' }] })} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {ROLES.map((r) => {
          const on = role === r.key;
          return (
            <Pressable
              key={r.key}
              onPress={() => setRole(r.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: on ? 2 : 1, borderColor: on ? r.tint.fg : colors.line, padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: r.tint.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <r.Icon size={22} color={r.tint.fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <T w="extrabold" size={16}>
                    {r.title}
                  </T>
                  <T size={12.5} color={colors.muted}>
                    {r.text}
                  </T>
                </View>
                {on ? <CheckCircle2 size={22} color={r.tint.fg} /> : <View style={styles.radio} />}
              </View>
              <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, gap: 6 }}>
                {r.points.map((p) => (
                  <View key={p} style={{ flexDirection: 'row', gap: 8 }}>
                    <T size={13} color={r.tint.fg}>
                      •
                    </T>
                    <T size={13} color={colors.ink2} style={{ flex: 1 }}>
                      {p}
                    </T>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
        <T size={12} color={colors.muted} lh={18} style={{ paddingHorizontal: 4 }}>
          One account works in one role. To offer both, register the second with another mobile number.
        </T>
      </ScrollView>
      <View style={{ padding: 16, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line }}>
        <Button
          title="Continue"
          onPress={() => {
            dispatch({ type: 'SELECT_ROLE', role });
            nav.navigate('BasicDetails');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  demo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: radius.md, borderWidth: 1.5, backgroundColor: colors.white },
  demoIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong },
});
