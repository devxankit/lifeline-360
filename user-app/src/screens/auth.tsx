import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Button, Chip, Field } from '../components/ui';
import { Fade, LifelineMark, Wordmark } from '../components/brand';
import { colors, radius } from '../theme';
import { images } from '../data/catalog';
import { bloodGroups } from '../data/catalog';
import { useStore } from '../store/AppStore';

const { width: W } = Dimensions.get('window');

/* ---------------------------------------------------------------- Splash */

export function SplashScreen({ navigation }: any) {
  const { hydrated, onboarded, user } = useStore();
  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      const next = !onboarded ? 'Onboarding' : !user ? 'Login' : !user.name ? 'ProfileSetup' : 'Main';
      navigation.reset({ index: 0, routes: [{ name: next }] });
    }, 1100);
    return () => clearTimeout(t);
  }, [hydrated, onboarded, user, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle="dark-content" />
      <Image source={images.logo} style={{ width: 132, height: 132 }} resizeMode="contain" accessibilityLabel="Lifeline 360" />
      <View style={{ marginTop: 18, alignItems: 'center', gap: 6 }}>
        <T w="extrabold" size={26} color="#701282">
          LIFE LINE 360
        </T>
        <T w="semibold" size={12} color="#C62E57" style={{ letterSpacing: 5 }}>
          SINCE 2026
        </T>
      </View>
      <T size={12} color={colors.muted} style={{ position: 'absolute', bottom: 48 }}>
        Healthcare, one tap away
      </T>
    </View>
  );
}

/* ------------------------------------------------------------ Onboarding */

const SLIDES = [
  { img: images.heroCare, title: 'Doctors you can trust', text: 'Book clinic visits or video consultations with verified doctors near you.' },
  { img: images.bannerNurse, title: 'Care that comes home', text: 'Nurses, caretakers, lab sample pickup and medicines delivered to your door.' },
  { img: images.bannerFamily, title: 'Help in an emergency', text: 'Book an ambulance in seconds, track it live and find blood when it matters.' },
];

export function OnboardingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useStore();
  const [i, setI] = useState(0);
  const ref = useRef<FlatList>(null);
  const finish = () => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };
  const next = () => {
    if (i < SLIDES.length - 1) ref.current?.scrollToIndex({ index: i + 1 });
    else finish();
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item }) => (
          <View style={{ width: W }}>
            <View style={{ height: 470 }}>
              <Image source={item.img} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <Fade color={colors.white} direction="vertical" fromOpacity={0} toOpacity={1} stops={[0.55, 1]} />
            </View>
            <View style={{ paddingHorizontal: 28, gap: 10, marginTop: -8 }}>
              <T w="extrabold" size={26} lh={32}>
                {item.title}
              </T>
              <T size={15} color={colors.ink2} lh={22}>
                {item.text}
              </T>
            </View>
          </View>
        )}
      />
      <Pressable onPress={finish} style={{ position: 'absolute', top: insets.top + 10, right: 16, paddingHorizontal: 14, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center' }}>
        <T w="bold" size={13} color={colors.white}>
          Skip
        </T>
      </Pressable>
      <View style={{ paddingHorizontal: 28, paddingBottom: insets.bottom + 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {SLIDES.map((s, k) => (
            <View key={s.title} style={{ width: k === i ? 22 : 7, height: 7, borderRadius: 4, backgroundColor: k === i ? colors.teal : colors.lineStrong }} />
          ))}
        </View>
        <Button title={i === SLIDES.length - 1 ? 'Get started' : 'Next'} onPress={next} style={{ minWidth: 140 }} />
      </View>
    </View>
  );
}

/* ----------------------------------------------------------------- Login */

export function LoginScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const valid = /^[6-9]\d{9}$/.test(phone);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 32, paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LifelineMark size={40} />
          <Wordmark size={20} />
        </View>
        <T w="extrabold" size={26} style={{ marginTop: 40 }} lh={32}>
          Enter your mobile number
        </T>
        <T size={14} color={colors.ink2} style={{ marginTop: 8 }} lh={20}>
          We’ll send a 6-digit code to verify it’s you.
        </T>
        <Field
          style={{ marginTop: 28 }}
          label="Mobile number"
          value={phone}
          onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          keyboardType="number-pad"
          placeholder="98765 43210"
          autoFocus
          maxLength={10}
          left={
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 10, borderRightWidth: 1, borderRightColor: colors.line }}>
              <T w="bold" size={15}>
                +91
              </T>
            </View>
          }
          error={phone.length === 10 && !valid ? 'Enter a valid Indian mobile number' : undefined}
        />
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <ShieldCheck size={16} color={colors.teal} />
          <T size={12} color={colors.muted} style={{ flex: 1 }} lh={17}>
            By continuing you agree to our Terms and Privacy Policy.
          </T>
        </View>
        <Button title="Get OTP" disabled={!valid} onPress={() => navigation.navigate('Otp', { phone })} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ------------------------------------------------------------------- OTP */

export function OtpScreen({ navigation, route }: any) {
  const phone: string = route.params.phone;
  const insets = useSafeAreaInsets();
  const { login } = useStore();
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(30);
  const [busy, setBusy] = useState(false);
  const input = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const verify = () => {
    setBusy(true);
    // Demo build: any 6-digit code is accepted until the SMS gateway is connected.
    setTimeout(() => {
      login(phone);
      setBusy(false);
      navigation.reset({ index: 0, routes: [{ name: 'Splash' }] });
    }, 700);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppBar border={false} />
      <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
        <T w="extrabold" size={26}>
          Verify your number
        </T>
        <T size={14} color={colors.ink2} style={{ marginTop: 8 }} lh={20}>
          Enter the code sent to <T w="bold">+91 {phone.slice(0, 5)} {phone.slice(5)}</T>
        </T>
        <Pressable onPress={() => input.current?.focus()} style={{ flexDirection: 'row', gap: 10, marginTop: 28 }}>
          {Array.from({ length: 6 }).map((_, k) => {
            const ch = code[k];
            const active = k === code.length;
            return (
              <View
                key={k}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: radius.md,
                  borderWidth: active ? 1.5 : 1,
                  borderColor: active ? colors.teal : ch ? colors.ink2 : colors.lineStrong,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.white,
                }}>
                <T w="bold" size={22}>
                  {ch ?? ''}
                </T>
              </View>
            );
          })}
        </Pressable>
        <TextInput
          ref={input}
          value={code}
          onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          autoFocus
          maxLength={6}
          style={{ position: 'absolute', opacity: 0, height: 1, width: 1 }}
          accessibilityLabel="One-time code"
        />
        <View style={{ flexDirection: 'row', marginTop: 18, gap: 6 }}>
          <T size={13} color={colors.muted}>
            Didn’t get it?
          </T>
          {left > 0 ? (
            <T w="semibold" size={13} color={colors.muted}>
              Resend in 0:{String(left).padStart(2, '0')}
            </T>
          ) : (
            <Pressable onPress={() => setLeft(30)}>
              <T w="bold" size={13} color={colors.teal}>
                Resend code
              </T>
            </Pressable>
          )}
        </View>
        <View style={{ flex: 1 }} />
        <T size={12} color={colors.muted} center style={{ marginBottom: 12 }}>
          Demo build: any 6-digit code works.
        </T>
        <Button title="Verify & continue" disabled={code.length !== 6} loading={busy} onPress={verify} />
      </View>
    </KeyboardAvoidingView>
  );
}

/* --------------------------------------------------------- Profile setup */

export function ProfileSetupScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, saveProfile } = useStore();
  const [name, setName] = useState(user?.name ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [dob, setDob] = useState(user?.dob ?? '');
  const [blood, setBlood] = useState(user?.bloodGroup ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const ok = name.trim().length >= 2 && gender;

  const onDob = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 8);
    setDob([d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/'));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.white }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: 24, paddingBottom: 24, gap: 18 }} keyboardShouldPersistTaps="handled">
        <View>
          <T w="extrabold" size={26}>
            Tell us about you
          </T>
          <T size={14} color={colors.ink2} style={{ marginTop: 8 }} lh={20}>
            Doctors and labs use this to prepare for your visit.
          </T>
        </View>
        <Field label="Full name" value={name} onChangeText={setName} placeholder="As on your ID" autoCapitalize="words" />
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>
            Gender
          </T>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Female', 'Male', 'Other'].map((g) => (
              <Chip key={g} label={g} active={gender === g} onPress={() => setGender(g)} style={{ flex: 1, justifyContent: 'center', height: 44 }} />
            ))}
          </View>
        </View>
        <Field label="Date of birth" value={dob} onChangeText={onDob} placeholder="DD/MM/YYYY" keyboardType="number-pad" />
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>
            Blood group (optional)
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {bloodGroups.map((g) => (
              <Chip key={g} label={g} active={blood === g} onPress={() => setBlood(g)} style={{ width: (W - 48 - 24) / 4, justifyContent: 'center' }} />
            ))}
          </View>
        </View>
        <Field label="Email (optional)" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 16, paddingTop: 8 }}>
        <Button
          title="Continue"
          disabled={!ok}
          onPress={() => {
            saveProfile({ name: name.trim(), gender, dob, bloodGroup: blood, email: email.trim() });
            navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
