import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Navigation2,
  PhoneCall,
  MapPin,
  Building2,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  UserCheck,
} from 'lucide-react-native';
import { DesignedMap } from '../../components/brand';
import T from '../../components/T';
import { Button, Card, Badge } from '../../components/ui';
import { SwipeToConfirm } from '../../components/driver-ui';
import { colors, radius, shadow } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';
import { rupees } from '../../utils/format';

export default function ActiveTripScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { activeTrip, advanceTripStage } = useDriverStore();
  useKeepAwake();
  const [mapHeight, setMapHeight] = useState(0);

  const req = activeTrip.request;

  if (!req) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy, justifyContent: 'center', alignItems: 'center' }}>
        <T color={colors.white}>No active trip in progress.</T>
        <Button title="Return to Home" onPress={() => nav.navigate('MainTabs')} style={{ marginTop: 12 }} />
      </View>
    );
  }

  const isGoingToHospital =
    activeTrip.stage === 'PATIENT_ON_BOARD' ||
    activeTrip.stage === 'TO_HOSPITAL' ||
    activeTrip.stage === 'REACHED' ||
    activeTrip.stage === 'COMPLETED';

  const mapMode = isGoingToHospital ? 'to_hospital' : 'to_pickup';

  // Live ETA from the simulated position along the route.
  const driving = activeTrip.stage === 'TO_PICKUP' || activeTrip.stage === 'TO_HOSPITAL';
  const legKm = activeTrip.stage === 'TO_HOSPITAL' ? req.hospitalDistanceKm : req.distanceKm;
  const legMin = activeTrip.stage === 'TO_HOSPITAL' ? Math.max(4, Math.round(req.hospitalDistanceKm * 2)) : req.etaMinutes;
  const kmLeft = Math.max(0, legKm * (1 - activeTrip.progress));
  const etaMin = Math.max(1, Math.round(legMin * (1 - activeTrip.progress)));

  // Get current stage title and action text
  let stageTitle = 'NAVIGATING TO PICKUP';
  let stageSub = `Patient: ${req.patientName} (${req.distanceKm} km away)`;
  let sliderAction = 'SWIPE: ARRIVED AT PICKUP';

  if (activeTrip.stage === 'ARRIVED') {
    stageTitle = 'ARRIVED AT PICKUP POINT';
    stageSub = 'Board patient & secure medical life support equipment';
    sliderAction = 'SWIPE: PATIENT ON BOARD';
  } else if (activeTrip.stage === 'PATIENT_ON_BOARD' || activeTrip.stage === 'TO_HOSPITAL') {
    stageTitle = 'EMERGENCY TRANSIT TO HOSPITAL';
    stageSub = `${req.hospitalName} (${req.hospitalDistanceKm} km)`;
    sliderAction = 'SWIPE: REACHED HOSPITAL';
  } else if (activeTrip.stage === 'REACHED' || activeTrip.stage === 'COMPLETED') {
    stageTitle = 'REACHED HOSPITAL EMERGENCY';
    stageSub = 'Hand over to triage desk & complete admission handover';
    sliderAction = 'SWIPE TO COMPLETE TRIP';
  }

  const handleSliderAdvance = () => {
    if (activeTrip.stage === 'REACHED' || activeTrip.stage === 'COMPLETED') {
      nav.navigate('TripComplete');
    } else {
      advanceTripStage();
    }
  };

  const handleOpenGoogleMaps = () => {
    const query = isGoingToHospital ? req.hospitalName : req.pickupAddress;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url).catch(() => {});
  };

  const handleCall = () => {
    nav.navigate('MaskedCall', { name: req.patientName, role: 'Patient Attendant' });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Navigation HUD */}
      <View style={styles.hudHeader}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Activity size={16} color={isGoingToHospital ? colors.red : colors.teal} />
            <T w="extrabold" size={13} color={isGoingToHospital ? colors.redText : colors.teal}>
              {stageTitle}
            </T>
          </View>
          <T w="bold" size={15} color={colors.white} numberOfLines={1} style={{ marginTop: 2 }}>
            {stageSub}
          </T>
        </View>

        <Pressable
          onPress={handleOpenGoogleMaps}
          style={{
            backgroundColor: colors.sky,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: radius.md,
          }}>
          <Navigation2 size={16} color={colors.white} />
          <T w="bold" size={12} color={colors.white}>
            Maps
          </T>
        </Pressable>
      </View>

      {/* Live Driving Route Map: fills the space between the header and the sheet */}
      <View style={{ flex: 1 }} onLayout={(e) => setMapHeight(e.nativeEvent.layout.height)}>
        {mapHeight ? (
          <DesignedMap
            progress={activeTrip.progress}
            destinationLabel={req.hospitalName}
            pickupLabel={req.patientName}
            mode={mapMode}
            dark={true}
            height={mapHeight}
          />
        ) : null}
        {driving ? (
          <View style={styles.etaChip}>
            <T w="extrabold" size={18} color={colors.white}>
              {etaMin} min
            </T>
            <T size={11} color={colors.navyMuted}>
              {kmLeft.toFixed(1)} km left
            </T>
          </View>
        ) : null}
      </View>

      {/* Bottom Floating Control Sheet */}
      <View style={[styles.controlSheet, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {/* Patient / Destination info card */}
        <Card dark style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.avatarMini}>
                <T w="bold" size={12} color={colors.tealDark}>
                  {req.patientName.charAt(0)}
                </T>
              </View>
              <View>
                <T w="bold" size={15} color={colors.white}>
                  {req.patientName}
                </T>
                <T size={12} color={colors.navyMuted}>
                  {req.patientAge}y · {req.patientGender} · {req.bookingCode}
                </T>
              </View>
            </View>

            <Pressable
              onPress={handleCall}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.teal,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PhoneCall size={18} color={colors.white} />
            </Pressable>
          </View>

          <View style={{ height: 1, backgroundColor: colors.navyLine, marginVertical: 8 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MapPin size={16} color={isGoingToHospital ? colors.red : colors.teal} />
            <T size={13} color={colors.white} numberOfLines={1} style={{ flex: 1 }}>
              {isGoingToHospital ? req.hospitalName : req.pickupAddress}
            </T>
          </View>
        </Card>

        {/* Action slider */}
        <SwipeToConfirm
          title={sliderAction}
          color={isGoingToHospital ? colors.red : colors.teal}
          onConfirm={handleSliderAdvance}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  etaChip: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
    backgroundColor: 'rgba(8, 20, 32, 0.88)',
    borderWidth: 1,
    borderColor: colors.navyLine,
  },
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  hudHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.navyCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.navyLine,
    ...shadow.card,
  },
  controlSheet: {
    backgroundColor: colors.navyCard,
    borderTopWidth: 1,
    borderTopColor: colors.navyLine,
    paddingHorizontal: 16,
    paddingTop: 14,
    ...shadow.sheet,
  },
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

