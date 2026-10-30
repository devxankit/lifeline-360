import React from 'react';
import { Pressable, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity, CalendarDays, CreditCard, House, User } from 'lucide-react-native';
import T from '../components/T';
import { colors } from '../theme';

import { LoginScreen, OnboardingScreen, OtpScreen, ProfileSetupScreen, SplashScreen } from '../screens/auth';
import { HomeScreen, NotificationsScreen, SearchScreen } from '../screens/home';
import { CallScreen, CheckoutScreen, PaymentProcessingScreen, SuccessScreen } from '../screens/checkout';
import { AppointmentDetailScreen, DoctorProfileScreen, FindDoctorScreen, VideoCallScreen } from '../screens/doctor';
import { CartScreen, MedicineStoreScreen, OrderTrackingScreen, ProductDetailScreen, UploadPrescriptionScreen } from '../screens/medicine';
import { NursingHomeScreen, NursingServiceScreen } from '../screens/nursing';
import { AmbulanceBookScreen, AmbulanceSearchingScreen, AmbulanceTrackingScreen, TripCompleteScreen } from '../screens/ambulance';
import { LabHomeScreen, LabScheduleScreen, LabTestDetailScreen, ReportViewScreen } from '../screens/lab';
import { BloodBanksScreen, BloodRaiseScreen, BloodRequestScreen, BloodStatusScreen } from '../screens/blood';
import { MembershipPlansScreen, MembershipScreen } from '../screens/membership';
import { BookingDetailScreen, BookingsScreen } from '../screens/bookings';
import { HealthScreen } from '../screens/health';
import {
  AddressesScreen, AddressFormScreen, ComplaintScreen, EditProfileScreen, EmergencyContactsScreen, FamilyScreen, HelpScreen, LanguageScreen, LegalScreen,
  MemberFormScreen, NotificationPrefsScreen, ProfileScreen,
} from '../screens/profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home', label: 'Home', Icon: House, component: HomeScreen },
  { name: 'Bookings', label: 'Bookings', Icon: CalendarDays, component: BookingsScreen },
  { name: 'Health', label: 'Health', Icon: Activity, component: HealthScreen },
  { name: 'Membership', label: 'Membership', Icon: CreditCard, component: MembershipScreen },
  { name: 'Profile', label: 'Profile', Icon: User, component: ProfileScreen },
];

/** Flat tab bar from the canvas: hairline top border, teal marker on the active tab. */
function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: '#E6EBE9', paddingBottom: Math.max(insets.bottom, 8), paddingTop: 8 }}>
      {state.routes.map((r, i) => {
        const tab = TABS.find((t) => t.name === r.name)!;
        const focused = state.index === i;
        return (
          <Pressable
            key={r.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            onPress={() => {
              const e = navigation.emit({ type: 'tabPress', target: r.key, canPreventDefault: true });
              if (!focused && !e.defaultPrevented) navigation.navigate(r.name);
            }}
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 }}>
            {focused ? <View style={{ position: 'absolute', top: -9, width: 28, height: 3, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, backgroundColor: colors.teal }} /> : null}
            <tab.Icon size={23} color={focused ? colors.teal : colors.muted} strokeWidth={focused ? 2.2 : 1.8} fill={focused && tab.name === 'Home' ? colors.teal : 'transparent'} />
            <T w={focused ? 'bold' : 'semibold'} size={11} color={focused ? colors.teal : colors.muted}>
              {tab.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

const renderTabBar = (p: BottomTabBarProps) => <TabBar {...p} />;

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      {TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.teal } };

export default function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />

        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade_from_bottom' }} />

        <Stack.Screen name="FindDoctor" component={FindDoctorScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ animation: 'fade', orientation: 'portrait' }} />

        <Stack.Screen name="MedicineStore" component={MedicineStoreScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="UploadPrescription" component={UploadPrescriptionScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />

        <Stack.Screen name="NursingHome" component={NursingHomeScreen} />
        <Stack.Screen name="NursingService" component={NursingServiceScreen} />

        <Stack.Screen name="AmbulanceBook" component={AmbulanceBookScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="AmbulanceSearching" component={AmbulanceSearchingScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="AmbulanceTracking" component={AmbulanceTrackingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TripComplete" component={TripCompleteScreen} options={{ gestureEnabled: false }} />

        <Stack.Screen name="LabHome" component={LabHomeScreen} />
        <Stack.Screen name="LabTestDetail" component={LabTestDetailScreen} />
        <Stack.Screen name="LabSchedule" component={LabScheduleScreen} />
        <Stack.Screen name="ReportView" component={ReportViewScreen} />

        <Stack.Screen name="BloodRequest" component={BloodRequestScreen} />
        <Stack.Screen name="BloodBanks" component={BloodBanksScreen} />
        <Stack.Screen name="BloodRaise" component={BloodRaiseScreen} />
        <Stack.Screen name="BloodStatus" component={BloodStatusScreen} />

        <Stack.Screen name="MembershipPlans" component={MembershipPlansScreen} />

        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="Success" component={SuccessScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="Call" component={CallScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Addresses" component={AddressesScreen} />
        <Stack.Screen name="AddressForm" component={AddressFormScreen} />
        <Stack.Screen name="Family" component={FamilyScreen} />
        <Stack.Screen name="MemberForm" component={MemberFormScreen} />
        <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
        <Stack.Screen name="NotificationPrefs" component={NotificationPrefsScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Complaint" component={ComplaintScreen} />
        <Stack.Screen name="Legal" component={LegalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
