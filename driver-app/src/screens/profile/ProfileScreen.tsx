import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  User,
  Ambulance,
  FileText,
  Settings,
  ShieldAlert,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Award,
} from 'lucide-react-native';
import { AppBar, Card, ListRow, Avatar, Button, Badge } from '../../components/ui';
import T from '../../components/T';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';

export default function ProfileScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { profile, logout } = useDriverStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out from the Driver Console?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          nav.replace('PhoneLogin');
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 16,
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Avatar name={profile.name} size={60} source={require('../../assets/images/driver-imran.jpg')} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <T w="extrabold" size={18}>
                {profile.name}
              </T>
              <Badge label="Verified Driver" variant="success" />
            </View>
            <T size={12} color={colors.muted} style={{ marginTop: 2 }}>
              ID: {profile.id} · {profile.phone}
            </T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={13} color={colors.amber} fill={colors.amber} />
                <T w="bold" size={12}>
                  {profile.rating}
                </T>
              </View>
              <T size={12} color={colors.muted}>
                {profile.totalTrips} Total Trips
              </T>
              <T size={12} color={colors.muted}>
                {profile.experienceYears}y Exp
              </T>
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Ambulance specs card */}
        <Card
          style={{ marginBottom: 14 }}
          onPress={() => nav.navigate('VehicleProfile')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: colors.tealTint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Ambulance size={20} color={colors.teal} />
              </View>
              <View>
                <T w="bold" size={15}>
                  {profile.vehicleType} Ambulance
                </T>
                <T size={12} color={colors.muted}>
                  {profile.vehiclePlate} · {profile.vehicleModel}
                </T>
              </View>
            </View>
            <ChevronRight size={18} color={colors.muted} />
          </View>
        </Card>

        {/* Menu rows */}
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.line,
            overflow: 'hidden',
            marginBottom: 16,
          }}>
          <ListRow
            icon={<FileText size={18} color={colors.teal} />}
            title="KYC Documents & Licences"
            subtitle="Driving licence, RC, permit, and renewals"
            onPress={() => nav.navigate('DocumentList')}
          />
          <ListRow
            icon={<ShieldAlert size={18} color={colors.red} />}
            title="SOS Dispatch Emergency"
            subtitle="Direct line to Lifeline 360 Control Room"
            onPress={() => nav.navigate('SosControl')}
          />
          <ListRow
            icon={<Settings size={18} color={colors.ink} />}
            title="App Settings"
            subtitle="Audio alarms, vibration & GPS navigation"
            onPress={() => nav.navigate('Settings')}
          />
          <ListRow
            icon={<HelpCircle size={18} color={colors.muted} />}
            title="Driver Support & Guidelines"
            subtitle="Emergency protocols and code of conduct"
            onPress={() => Alert.alert('Fleet Support', 'Call dispatch support at 1800-360-911 for 24x7 control room help.')}
            last
          />
        </View>

        {/* Sign out */}
        <Button
          title="Sign Out of Driver Account"
          variant="outline"
          icon={<LogOut size={16} color={colors.teal} />}
          onPress={handleLogout}
        />

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <T size={11} color={colors.muted}>
            Lifeline 360 Driver Partner · v1.0.0 (Build 1)
          </T>
        </View>
      </ScrollView>
    </View>
  );
}

