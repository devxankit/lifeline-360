import React from 'react';
import { Pressable, StatusBar, View } from 'react-native';
import { DefaultTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { useDriverStore } from '../store/DriverStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, Ambulance, CreditCard, User } from 'lucide-react-native';
import T from '../components/T';
import { colors } from '../theme';

// Auth screens
import SplashScreen from '../screens/auth/SplashScreen';
import PhoneLoginScreen from '../screens/auth/PhoneLoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';

// KYC screens
import DriverDetailsScreen from '../screens/kyc/DriverDetailsScreen';
import VehicleDetailsScreen from '../screens/kyc/VehicleDetailsScreen';
import DocumentListScreen from '../screens/kyc/DocumentListScreen';
import DocumentUploadScreen from '../screens/kyc/DocumentUploadScreen';
import KycPendingScreen from '../screens/kyc/KycPendingScreen';
import WelcomeApprovedScreen from '../screens/kyc/WelcomeApprovedScreen';

// Main Tabs
import HomeScreen from '../screens/home/HomeScreen';
import TripsListScreen from '../screens/trips/TripsListScreen';
import EarningsScreen from '../screens/earnings/EarningsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Modals and Active flows
import IncomingRequestModal from '../screens/request/IncomingRequestModal';
import DeclineSheet from '../screens/request/DeclineSheet';
import ActiveTripScreen from '../screens/trip/ActiveTripScreen';
import TripCompleteModal from '../screens/trip/TripCompleteModal';
import TripDetailScreen from '../screens/trips/TripDetailScreen';
import PayoutsScreen from '../screens/earnings/PayoutsScreen';
import VehicleProfileScreen from '../screens/profile/VehicleProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import SosControlScreen from '../screens/profile/SosControlScreen';
import MaskedCallModal from '../screens/profile/MaskedCallModal';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef<any>();

/** Screens drawn on the navy background get light status-bar icons; everything else dark. */
const DARK_SCREENS = new Set(['Splash', 'IncomingRequest', 'ActiveTrip', 'MaskedCall']);
function syncStatusBar() {
  const name = navigationRef.getCurrentRoute()?.name;
  StatusBar.setBarStyle(name && DARK_SCREENS.has(name) ? 'light-content' : 'dark-content', true);
}

/** Opens the incoming-request screen from anywhere in the app when an offer arrives. */
function RequestWatcher() {
  const { incomingRequest } = useDriverStore();
  React.useEffect(() => {
    if (!incomingRequest || !navigationRef.isReady()) return;
    if (navigationRef.getCurrentRoute()?.name !== 'IncomingRequest') navigationRef.navigate('IncomingRequest');
  }, [incomingRequest]);
  return null;
}
const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home', label: 'Home', Icon: House, component: HomeScreen },
  { name: 'Trips', label: 'Trips', Icon: Ambulance, component: TripsListScreen },
  { name: 'Earnings', label: 'Earnings', Icon: CreditCard, component: EarningsScreen },
  { name: 'Profile', label: 'Profile', Icon: User, component: ProfileScreen },
];

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.line,
        paddingBottom: Math.max(insets.bottom, 8),
        paddingTop: 8,
      }}>
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
            {focused ? (
              <View
                style={{
                  position: 'absolute',
                  top: -9,
                  width: 28,
                  height: 3,
                  borderBottomLeftRadius: 3,
                  borderBottomRightRadius: 3,
                  backgroundColor: colors.teal,
                }}
              />
            ) : null}
            <tab.Icon
              size={22}
              color={focused ? colors.teal : colors.muted}
              strokeWidth={focused ? 2.2 : 1.8}
            />
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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    primary: colors.teal,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef} theme={theme} onReady={syncStatusBar} onStateChange={syncStatusBar}>
      <RequestWatcher />
      <Stack.Navigator
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        initialRouteName="Splash">
        {/* Auth Stack */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="OtpVerification" component={OtpScreen} />

        {/* KYC Stack */}
        <Stack.Screen name="DriverDetails" component={DriverDetailsScreen} />
        <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
        <Stack.Screen name="DocumentList" component={DocumentListScreen} />
        <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
        <Stack.Screen name="KycPending" component={KycPendingScreen} />
        <Stack.Screen name="WelcomeApproved" component={WelcomeApprovedScreen} />

        {/* Main Console */}
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ animation: 'fade' }} />

        {/* Active Emergency Flow */}
        <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        <Stack.Screen name="Payouts" component={PayoutsScreen} />
        <Stack.Screen name="VehicleProfile" component={VehicleProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="SosControl" component={SosControlScreen} />

        {/* Priority Modals */}
        <Stack.Screen
          name="IncomingRequest"
          component={IncomingRequestModal}
          options={{ presentation: 'fullScreenModal', animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="DeclineSheet"
          component={DeclineSheet}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="TripComplete"
          component={TripCompleteModal}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="MaskedCall"
          component={MaskedCallModal}
          options={{ presentation: 'fullScreenModal', animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

