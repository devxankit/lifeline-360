import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Radio,
  PhoneCall,
  Shield,
  Activity,
} from 'lucide-react-native';
import { LifelineMark, Wordmark, DesignedMap } from '../../components/brand';
import T from '../../components/T';
import { Button, Card, Badge, IconButton } from '../../components/ui';
import { OnlineToggle, StatTile } from '../../components/driver-ui';
import { colors, radius, shadow } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';
import { rupees } from '../../utils/format';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    profile,
    isOnline,
    toggleOnline,
    todayStats,
    activeTrip,
    incomingRequest,
    triggerSimulatedRequest,
  } = useDriverStore();


  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Top App Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: colors.white,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <LifelineMark size={32} />
          <View>
            <Wordmark size={18} />
            <T size={12} color={colors.muted}>
              {profile.vehicleType} Ambulance · {profile.vehiclePlate}
            </T>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.amberSoft,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: radius.pill,
              gap: 4,
            }}>
            <Star size={13} color={colors.amber} fill={colors.amber} />
            <T w="bold" size={12} color={colors.amberText}>
              {profile.rating}
            </T>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Active Trip Banner if running */}
        {activeTrip.stage !== 'IDLE' ? (
          <Pressable
            onPress={() => nav.navigate('ActiveTrip')}
            style={({ pressed }) => [
              {
                backgroundColor: colors.red,
                borderRadius: radius.lg,
                padding: 16,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: pressed ? 0.85 : 1,
                ...shadow.raised,
              },
            ]}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Activity size={18} color={colors.white} />
                <T w="extrabold" size={14} color={colors.white}>
                  EMERGENCY TRIP IN PROGRESS
                </T>
              </View>
              <T size={12} color={colors.white} style={{ opacity: 0.9 }} numberOfLines={1}>
                {activeTrip.request?.patientName} ({activeTrip.request?.condition})
              </T>
            </View>
            <View
              style={{
                backgroundColor: colors.white,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: radius.md,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
              <T w="bold" size={12} color={colors.red}>
                RESUME
              </T>
              <ArrowRight size={14} color={colors.red} />
            </View>
          </Pressable>
        ) : null}

        {/* Online / Offline status toggle */}
        <OnlineToggle isOnline={isOnline} onToggle={toggleOnline} />

        {/* Map View showing current position */}
        <View
          style={{
            marginTop: 16,
            borderRadius: radius.lg,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.line,
            backgroundColor: colors.white,
          }}>
          <View style={{ height: 200, width: '100%' }}>
            <DesignedMap height={200} mode="idle" />
          </View>
          <View
            style={{
              padding: 12,
              backgroundColor: colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <T w="bold" size={13}>
                Current Standby Zone
              </T>
              <T size={12} color={colors.muted}>
                Indiranagar · GPS signal active
              </T>
            </View>
            <Badge label={isOnline ? 'Online' : 'Offline'} variant={isOnline ? 'success' : 'neutral'} />
          </View>
        </View>

        {/* Today's Shift Metrics */}
        <View style={{ marginTop: 20 }}>
          <T w="extrabold" size={16} style={{ marginBottom: 12 }}>
            Today's Shift Summary
          </T>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <StatTile
              label="Today Earnings"
              value={rupees(todayStats.earningsTotal)}
              sublabel="Net after commission"
              icon={<CheckCircle2 size={16} color={colors.teal} />}
            />
            <StatTile
              label="Completed Trips"
              value={`${todayStats.tripsCount}`}
              sublabel="100% completion"
              icon={<Radio size={16} color={colors.sky} />}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <StatTile
              label="Online Time"
              value={todayStats.hoursOnline}
              sublabel="Current shift"
              icon={<Clock size={16} color={colors.amber} />}
            />
            <StatTile
              label="Acceptance Rate"
              value={`${todayStats.acceptanceRate}%`}
              sublabel="High priority tier"
              icon={<Flame size={16} color={colors.red} />}
            />
          </View>
        </View>

        {/* Demo dispatch status: requests arrive on their own while online */}
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 12,
            borderRadius: radius.md,
            backgroundColor: isOnline ? colors.tealTint : colors.surface2,
          }}>
          <Radio size={18} color={isOnline ? colors.teal : colors.muted} />
          <View style={{ flex: 1 }}>
            <T w="bold" size={13} color={isOnline ? colors.tealDark : colors.ink}>
              {activeTrip.stage !== 'IDLE' ? 'On an emergency trip' : isOnline ? 'Waiting for emergency requests' : 'You are offline'}
            </T>
            <T size={11} color={colors.muted}>
              Demo build: requests arrive automatically while you are online.
            </T>
          </View>
          {isOnline && activeTrip.stage === 'IDLE' ? (
            <Pressable onPress={triggerSimulatedRequest} hitSlop={8}>
              <T w="bold" size={12} color={colors.teal}>
                Send now
              </T>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

