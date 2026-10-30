import React, { useEffect } from 'react';
import { Pressable, StatusBar, View } from 'react-native';
import { DefaultTheme, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarCheck, CalendarDays, Package, ShoppingBag, TrendingUp, User } from 'lucide-react-native';
import { T, colors, service } from '../ui';
import { usePartnerStore } from '../store/PartnerStore';

import { LoginScreen, OtpScreen, RoleSelectionScreen, SplashScreen } from '../screens/shared/AuthScreens';
import { BasicDetailsScreen, DocumentUploadScreen, KycDocumentsScreen, KycPendingScreen, WelcomeScreen } from '../screens/shared/OnboardingScreens';
import {
  DocumentsStatusScreen,
  EarningsScreen,
  EditCaretakerProfileScreen,
  HelpScreen,
  LegalScreen,
  MaskedCallScreen,
  NotificationsScreen,
  PayoutAccountScreen,
  PharmacyProfileScreen,
  ProfileScreen,
  SettingsScreen,
  TransactionsScreen,
} from '../screens/shared/AccountScreens';
import { OrderAlertScreen, OrderDetailScreen, OrderHistoryScreen, VendorOrdersScreen } from '../screens/vendor/OrderScreens';
import { HandoverScreen, PackingScreen, RxQuoteScreen } from '../screens/vendor/FulfilScreens';
import { CategoriesScreen, MedicineFormScreen, VendorCatalogueScreen } from '../screens/vendor/CatalogueScreens';
import { BookingDetailScreen, CaretakerRequestsScreen, CaretakerTodayScreen, RequestAlertScreen } from '../screens/caretaker/BookingScreens';
import { ActiveServiceScreen, AvailabilityScreen, CheckInScreen, CompleteServiceScreen, RatingsScreen, ServicesRatesScreen } from '../screens/caretaker/ShiftScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef<any>();

const DARK_SCREENS = new Set(['Splash', 'OrderAlert', 'RequestAlert', 'MaskedCall']);
function syncStatusBar() {
  const current = navigationRef.getCurrentRoute()?.name;
  StatusBar.setBarStyle(current && DARK_SCREENS.has(current) ? 'light-content' : 'dark-content', true);
}

type TabDef = { name: string; label: string; Icon: typeof ShoppingBag; component: React.ComponentType<any> };

const VENDOR_TABS: TabDef[] = [
  { name: 'VendorOrders', label: 'Orders', Icon: ShoppingBag, component: VendorOrdersScreen },
  { name: 'VendorCatalogue', label: 'Catalogue', Icon: Package, component: VendorCatalogueScreen },
  { name: 'VendorEarnings', label: 'Earnings', Icon: TrendingUp, component: EarningsScreen },
  { name: 'VendorProfile', label: 'Profile', Icon: User, component: ProfileScreen },
];

const CARETAKER_TABS: TabDef[] = [
  { name: 'CaretakerToday', label: 'Today', Icon: CalendarDays, component: CaretakerTodayScreen },
  { name: 'CaretakerRequests', label: 'Bookings', Icon: CalendarCheck, component: CaretakerRequestsScreen },
  { name: 'CaretakerEarnings', label: 'Earnings', Icon: TrendingUp, component: EarningsScreen },
  { name: 'CaretakerProfile', label: 'Profile', Icon: User, component: ProfileScreen },
];

function PartnerTabBar({ state, navigation, tabs, activeColor }: BottomTabBarProps & { tabs: TabDef[]; activeColor: string }) {
  const insets = useSafeAreaInsets();
  const { orders, bookings } = usePartnerStore();
  const badges: Record<string, number> = {
    VendorOrders: orders.filter((o) => o.status === 'new').length,
    CaretakerRequests: bookings.filter((b) => b.status === 'requested').length,
  };
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, paddingBottom: Math.max(insets.bottom, 8), paddingTop: 8 }}>
      {state.routes.map((route, index) => {
        const tab = tabs.find((t) => t.name === route.name) ?? tabs[0];
        const focused = state.index === index;
        const badge = badges[route.name] ?? 0;
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 }}>
            {focused ? <View style={{ position: 'absolute', top: -8, width: 28, height: 3, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, backgroundColor: activeColor }} /> : null}
            <View>
              <tab.Icon size={22} color={focused ? activeColor : colors.muted} strokeWidth={focused ? 2.2 : 1.8} />
              {badge ? (
                <View style={{ position: 'absolute', top: -4, right: -9, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
                  <T w="bold" size={9.5} color={colors.white}>
                    {badge}
                  </T>
                </View>
              ) : null}
            </View>
            <T w={focused ? 'bold' : 'semibold'} size={11} color={focused ? activeColor : colors.muted}>
              {tab.label}
            </T>
          </Pressable>
        );
      })}
    </View>
  );
}

const renderVendorTabBar = (p: BottomTabBarProps) => <PartnerTabBar {...p} tabs={VENDOR_TABS} activeColor={colors.green} />;
const renderCaretakerTabBar = (p: BottomTabBarProps) => <PartnerTabBar {...p} tabs={CARETAKER_TABS} activeColor={service.nursing.fg} />;

function VendorTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderVendorTabBar}>
      {VENDOR_TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

function CaretakerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderCaretakerTabBar}>
      {CARETAKER_TABS.map((t) => (
        <Tab.Screen key={t.name} name={t.name} component={t.component} />
      ))}
    </Tab.Navigator>
  );
}

/** Screens where an incoming alert must not interrupt the partner. */
const NO_INTERRUPT = new Set(['OrderAlert', 'RequestAlert', 'MaskedCall', 'Handover', 'CompleteService', 'CheckIn', 'Packing', 'RxQuote']);

/** Opens the full-screen alert when a new order or booking request arrives. */
function AlertWatcher() {
  const { session, orders, bookings } = usePartnerStore();
  const pendingOrder = orders.find((o) => o.status === 'new' && !o.seen);
  const pendingRequest = bookings.find((b) => b.status === 'requested' && !b.seen);
  const id = session.role === 'vendor' ? pendingOrder?.id : session.role === 'caretaker' ? pendingRequest?.id : undefined;

  useEffect(() => {
    if (!id || session.kycStatus !== 'approved' || !navigationRef.isReady()) return;
    const current = navigationRef.getCurrentRoute()?.name ?? '';
    const inApp = navigationRef.getRootState()?.routes.some((r) => r.name === 'VendorTabs' || r.name === 'CaretakerTabs');
    if (!inApp || NO_INTERRUPT.has(current)) return;
    navigationRef.navigate(session.role === 'vendor' ? 'OrderAlert' : 'RequestAlert', { id });
  }, [id, session.role, session.kycStatus]);
  return null;
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.teal } };

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef} theme={theme} onReady={syncStatusBar} onStateChange={syncStatusBar}>
      <AlertWatcher />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} />
        <Stack.Screen name="KycDocuments" component={KycDocumentsScreen} />
        <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
        <Stack.Screen name="KycPending" component={KycPendingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ animation: 'fade' }} />

        <Stack.Screen name="VendorTabs" component={VendorTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="CaretakerTabs" component={CaretakerTabs} options={{ animation: 'fade' }} />

        <Stack.Screen name="OrderAlert" component={OrderAlertScreen} options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="RxQuote" component={RxQuoteScreen} />
        <Stack.Screen name="Packing" component={PackingScreen} />
        <Stack.Screen name="Handover" component={HandoverScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Stack.Screen name="MedicineForm" component={MedicineFormScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="PharmacyProfile" component={PharmacyProfileScreen} />

        <Stack.Screen name="RequestAlert" component={RequestAlertScreen} options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} />
        <Stack.Screen name="ActiveService" component={ActiveServiceScreen} />
        <Stack.Screen name="CompleteService" component={CompleteServiceScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="ServicesRates" component={ServicesRatesScreen} />
        <Stack.Screen name="Ratings" component={RatingsScreen} />
        <Stack.Screen name="EditCaretakerProfile" component={EditCaretakerProfileScreen} />

        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="MaskedCall" component={MaskedCallScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="DocumentsStatus" component={DocumentsStatusScreen} />
        <Stack.Screen name="PayoutAccount" component={PayoutAccountScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Legal" component={LegalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
