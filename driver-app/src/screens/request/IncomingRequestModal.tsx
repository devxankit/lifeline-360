import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Vibration, Pressable } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  User,
  X,
  ShieldAlert,
} from 'lucide-react-native';
import T from '../../components/T';
import { CountdownRing, SwipeToConfirm } from '../../components/driver-ui';
import { Card } from '../../components/ui';
import { colors, radius } from '../../theme';
import { useDriverStore } from '../../store/DriverStore';
import { rupees } from '../../utils/format';

export default function IncomingRequestModal() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { incomingRequest, acceptRequest, declineRequest } = useDriverStore();
  const [secondsLeft, setSecondsLeft] = useState(30);

  const focused = useIsFocused();
  useKeepAwake();

  // Repeating emergency buzz until the driver accepts or declines.
  useEffect(() => {
    if (!focused) return;
    Vibration.vibrate([0, 600, 400, 600, 1200], true);
    return () => Vibration.cancel();
  }, [focused]);

  // 30-second countdown; it pauses while the decline sheet is open on top.
  useEffect(() => {
    if (!focused || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [focused, secondsLeft]);

  // Time ran out: the request goes to the next ambulance.
  useEffect(() => {
    if (secondsLeft > 0) return;
    declineRequest('Timeout expired');
    if (nav.canGoBack()) nav.goBack();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  if (!incomingRequest) {
    return <RequestGone />;
  }

  const handleAccept = () => {
    acceptRequest();
    nav.replace('ActiveTrip');
  };

  const handleDecline = () => {
    nav.navigate('DeclineSheet');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 }]}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <ShieldAlert size={18} color={colors.red} />
          <T w="extrabold" size={13} color={colors.redText}>
            PRIORITY EMERGENCY DISPATCH
          </T>
        </View>
        <Pressable onPress={handleDecline} hitSlop={10} style={styles.declineIcon}>
          <X size={20} color={colors.navyMuted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        {/* Central 30-sec Countdown Ring */}
        <View style={{ alignItems: 'center', marginVertical: 14 }}>
          <CountdownRing seconds={secondsLeft} maxSeconds={30} size={110} />
          <T size={12} color={colors.navyMuted} style={{ marginTop: 8 }}>
            Swipe below before timer expires
          </T>
        </View>

        {/* Patient Condition Card */}
        <Card dark style={styles.emergencyCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <T w="bold" size={15} color={colors.white}>
              {incomingRequest.patientName} ({incomingRequest.patientAge}y, {incomingRequest.patientGender})
            </T>
            <View style={{ backgroundColor: colors.redSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill }}>
              <T w="extrabold" size={11} color={colors.red}>
                {incomingRequest.severity.toUpperCase()}
              </T>
            </View>
          </View>
          <T size={13} color={colors.amber} w="semibold" style={{ marginBottom: 6 }}>
            {incomingRequest.condition}
          </T>
          <T size={12} color={colors.navyMuted}>
            Booking Ref: {incomingRequest.bookingCode} · {incomingRequest.serviceType}
          </T>
        </Card>

        {/* Route: Pickup & Hospital */}
        <Card dark style={styles.routeCard}>
          {/* Pickup */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            <View style={styles.pickupDot}>
              <MapPin size={16} color={colors.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <T size={11} color={colors.navyMuted} w="bold">
                PICKUP LOCATION ({incomingRequest.distanceKm} km · ~{incomingRequest.etaMinutes} min away)
              </T>
              <T w="bold" size={14} color={colors.white} style={{ marginTop: 2 }}>
                {incomingRequest.pickupAddress}
              </T>
              <T size={12} color={colors.navyMuted} style={{ marginTop: 2 }}>
                Landmark: {incomingRequest.pickupLandmark}
              </T>
            </View>
          </View>

          {/* Hospital destination */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View style={styles.hospitalDot}>
              <Building2 size={16} color={colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <T size={11} color={colors.navyMuted} w="bold">
                DESTINATION HOSPITAL ({incomingRequest.hospitalDistanceKm} km)
              </T>
              <T w="bold" size={14} color={colors.white} style={{ marginTop: 2 }}>
                {incomingRequest.hospitalName}
              </T>
              <T size={12} color={colors.navyMuted} style={{ marginTop: 2 }}>
                {incomingRequest.hospitalAddress}
              </T>
            </View>
          </View>
        </Card>

        {/* Fare Estimate */}
        <Card dark style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <T size={12} color={colors.navyMuted}>
              Estimated Total Fare
            </T>
            <T w="extrabold" size={20} color={colors.green}>
              {rupees(incomingRequest.estimatedFare)}
            </T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T size={12} color={colors.navyMuted}>
              Driver Share (80%)
            </T>
            <T w="bold" size={16} color={colors.white}>
              {rupees(Math.round(incomingRequest.estimatedFare * 0.8))}
            </T>
          </View>
        </Card>
      </ScrollView>

      {/* Action Footer: Swipe to Confirm */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <SwipeToConfirm
          title="SWIPE TO ACCEPT TRIP"
          color={colors.teal}
          onConfirm={handleAccept}
        />
        <Pressable onPress={handleDecline} hitSlop={8} style={{ alignItems: 'center', marginTop: 14 }}>
          <T size={13} color={colors.navyMuted} w="semibold">
            Decline Request
          </T>
        </Pressable>
      </View>
    </View>
  );
}

/** Shown for a frame if the offer is withdrawn while open; closes the modal. */
function RequestGone() {
  const nav = useNavigation<any>();
  useEffect(() => {
    if (nav.canGoBack()) nav.goBack();
  }, [nav]);
  return <View style={{ flex: 1, backgroundColor: colors.navy }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.redSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 6,
  },
  declineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.navyCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
  },
  routeCard: {
    marginBottom: 12,
  },
  pickupDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.navySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

