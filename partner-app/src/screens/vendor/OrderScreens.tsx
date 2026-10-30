import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, Switch, TextInput, Vibration, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { AlertTriangle, Bike, ChevronRight, ClipboardList, FileText, History, MapPin, Phone, Search, ShoppingBag } from 'lucide-react-native';
import { AppBar, Badge, BottomBar, Button, Chip, CountdownRing, EmptyState, InfoRow, T, colors, radius, rupees, service, timeAgo } from '../../ui';
import { formatDayTime, formatTime } from '../../ui/utils/format';
import { earningsSummary, isLowStock, orderTotal, useNow, usePartnerStore } from '../../store/PartnerStore';
import { OrderStatus, VendorOrder } from '../../store/types';
import { OrderStatusPill, ReasonSheet, RxPaper, TabHeader } from '../../components/partner';
import { COMMISSION, REJECT_REASONS } from '../../data/seed';

export const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const itemSummary = (o: VendorOrder) => {
  if (!o.items.length) return 'Prescription only · quote needed';
  const [first, ...rest] = o.items;
  return `${first.name} ×${first.qty}${rest.length ? `, +${rest.length} more` : ''}`;
};

/* ---------------------------------------------------------------- Order card */

export function OrderCard({ order, now, onPress }: { order: VendorOrder; now: number; onPress: () => void }) {
  const urgent = order.status === 'new';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: urgent ? '#F4B9BC' : colors.line,
        padding: 14,
        opacity: pressed ? 0.85 : 1,
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <T w="extrabold" size={14}>
          {order.code}
        </T>
        {order.prescription ? <Badge label="Rx" bg={service.medicine.bg} fg={service.medicine.text} /> : null}
        <View style={{ flex: 1 }} />
        <OrderStatusPill status={order.status} reason={order.rejectReason} />
      </View>
      <T size={12.5} color={colors.muted} style={{ marginTop: 4 }}>
        {order.customerName} · {order.customerArea} · {order.distanceKm} km
      </T>
      <T size={13.5} w="semibold" style={{ marginTop: 8 }} numberOfLines={1}>
        {itemSummary(order)}
      </T>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line }}>
        <T w="extrabold" size={15} style={{ flex: 1 }}>
          {order.items.length ? rupees(orderTotal(order)) : '—'}
          <T size={12} color={colors.muted}>
            {'  '}
            {order.payment}
          </T>
        </T>
        {urgent ? (
          <T w="bold" size={12.5} color={colors.redText}>
            Accept in {mmss(order.acceptBy - now)}
          </T>
        ) : (
          <T size={12} color={colors.muted}>
            {order.status === 'completed' || order.status === 'rejected' ? formatDayTime(order.completedAt ?? order.placedAt, now) : timeAgo(order.placedAt)}
          </T>
        )}
      </View>
    </Pressable>
  );
}

/* --------------------------------------------------------------- Orders tab */

type Tab = 'new' | 'packing' | 'ready' | 'done';
const TABS: { key: Tab; label: string; match: OrderStatus[] }[] = [
  { key: 'new', label: 'New', match: ['new', 'quote_sent'] },
  { key: 'packing', label: 'Packing', match: ['packing'] },
  { key: 'ready', label: 'Ready', match: ['ready'] },
  { key: 'done', label: 'Today’s completed', match: ['completed', 'rejected'] },
];

export function VendorOrdersScreen() {
  const nav = useNavigation<any>();
  const now = useNow();
  const { vendorProfile, isStoreOpen, orders, catalogue, ledger, dispatch } = usePartnerStore();
  const summary = earningsSummary(ledger.vendor, now);
  const lowStock = catalogue.filter(isLowStock);
  const outOfStock = catalogue.filter((m) => !m.inStock || m.stock === 0);
  const todayStart = new Date(now).setHours(0, 0, 0, 0);

  const counts = TABS.map((t) =>
    orders.filter((o) => t.match.includes(o.status) && (t.key !== 'done' || (o.completedAt ?? o.placedAt) >= todayStart)).length,
  );
  const [tab, setTab] = useState<Tab>(() => TABS[Math.max(0, counts.findIndex((c, i) => c > 0 && i < 3))].key);
  const active = TABS.find((t) => t.key === tab)!;
  const list = orders
    .filter((o) => active.match.includes(o.status) && (tab !== 'done' || (o.completedAt ?? o.placedAt) >= todayStart))
    .sort((a, b) => (tab === 'done' ? (b.completedAt ?? 0) - (a.completedAt ?? 0) : a.placedAt - b.placedAt));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TabHeader
        title={vendorProfile.storeName}
        subtitle={isStoreOpen ? `Open · ${vendorProfile.area} · till ${vendorProfile.closesAt}` : 'Closed · not receiving orders'}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <T w="bold" size={12} color={isStoreOpen ? colors.greenText : colors.muted}>
              {isStoreOpen ? 'Open' : 'Closed'}
            </T>
            <Switch
              accessibilityLabel="Store open"
              value={isStoreOpen}
              onValueChange={(open) => dispatch({ type: 'SET_OPEN', open, now: Date.now() })}
              trackColor={{ true: colors.green, false: '#C9CECC' }}
              thumbColor={colors.white}
            />
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28, gap: 12 }}>
        {!isStoreOpen ? (
          <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <AlertTriangle size={18} color={colors.ink2} />
            <T size={13} color={colors.ink2} style={{ flex: 1 }} lh={18}>
              Your store is closed. Customers can’t order from you until you switch it on.
            </T>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line }}>
          {[
            { label: 'Sales today', value: rupees(summary.todayGross) },
            { label: 'Orders today', value: String(summary.todayJobs) },
            { label: 'In progress', value: String(counts[0] + counts[1] + counts[2]) },
          ].map((s, i) => (
            <View key={s.label} style={{ flex: 1, padding: 12, borderLeftWidth: i ? 1 : 0, borderLeftColor: colors.line }}>
              <T size={11.5} color={colors.muted} w="semibold">
                {s.label}
              </T>
              <T w="extrabold" size={18} style={{ marginTop: 4 }}>
                {s.value}
              </T>
            </View>
          ))}
        </View>

        {lowStock.length || outOfStock.length ? (
          <Pressable
            onPress={() => nav.navigate('VendorCatalogue', { filter: 'low' })}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFE8DA', borderRadius: radius.md, padding: 12, opacity: pressed ? 0.8 : 1 })}>
            <AlertTriangle size={18} color="#8A3F12" />
            <View style={{ flex: 1 }}>
              <T w="bold" size={13} color="#8A3F12">
                {lowStock.length} running low · {outOfStock.length} out of stock
              </T>
              <T size={12} color="#8A3F12" numberOfLines={1}>
                {[...lowStock, ...outOfStock].slice(0, 3).map((m) => m.name).join(', ')}
              </T>
            </View>
            <ChevronRight size={18} color="#8A3F12" />
          </Pressable>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {TABS.map((t, i) => (
            <Chip key={t.key} label={`${t.label}${counts[i] ? ` · ${counts[i]}` : ''}`} active={tab === t.key} onPress={() => setTab(t.key)} />
          ))}
        </ScrollView>

        {list.length ? (
          list.map((o) => <OrderCard key={o.id} order={o} now={now} onPress={() => nav.navigate('OrderDetail', { id: o.id })} />)
        ) : (
          <EmptyState
            icon={<ShoppingBag size={28} color={colors.teal} />}
            title={tab === 'new' ? (isStoreOpen ? 'Waiting for orders' : 'Store is closed') : 'Nothing here'}
            text={tab === 'new' ? (isStoreOpen ? 'New orders appear here with a sound and an accept timer.' : 'Switch the store on to start receiving orders.') : 'Orders move here as you work on them.'}
          />
        )}

        <Pressable onPress={() => nav.navigate('OrderHistory')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8 }}>
          <History size={15} color={colors.teal} />
          <T w="bold" size={13} color={colors.teal}>
            Order history
          </T>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* --------------------------------------------------------- New order alert */

export function OrderAlertScreen() {
  useKeepAwake();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const now = useNow(500);
  const { orders, settings, dispatch } = usePartnerStore();
  const order = orders.find((o) => o.id === route.params?.id);
  const live = order?.status === 'new';

  useEffect(() => {
    if (!live || !settings.alertVibration) return;
    Vibration.vibrate([0, 500, 300, 500, 1500], true);
    return () => Vibration.cancel();
  }, [live, settings.alertVibration]);

  const close = () => {
    if (order) dispatch({ type: 'MARK_SEEN', id: order.id });
    nav.goBack();
  };

  if (!order || !live) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <T w="extrabold" size={20} color={colors.white} center>
          This order is no longer available
        </T>
        <Button title="Back to orders" onPress={() => nav.goBack()} style={{ marginTop: 20, alignSelf: 'stretch' }} />
      </View>
    );
  }

  const total = Math.round((order.acceptBy - order.placedAt) / 1000);
  const left = Math.max(0, Math.ceil((order.acceptBy - now) / 1000));
  return (
    <View style={{ flex: 1, backgroundColor: colors.navy, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }}>
      <StatusBar barStyle="light-content" />
      <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
        <Badge label={order.prescription ? 'NEW PRESCRIPTION ORDER' : 'NEW ORDER'} bg="#1F3A2F" fg="#7EE0B0" />
        <T w="extrabold" size={28} color={colors.white} style={{ marginTop: 12 }}>
          {order.items.length ? rupees(orderTotal(order)) : 'Quote needed'}
        </T>
        <T size={13} color={colors.navyMuted} style={{ marginTop: 4 }}>
          {order.code} · {order.payment}
        </T>
        <View style={{ marginTop: 20 }}>
          <CountdownRing seconds={left} maxSeconds={total} size={116} />
        </View>
      </View>

      <View style={{ margin: 20, backgroundColor: colors.navyCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.navyLine, padding: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} color={colors.navyMuted} />
          <T size={13.5} color={colors.navyText} w="semibold" style={{ flex: 1 }}>
            {order.customerArea} · {order.distanceKm} km away
          </T>
        </View>
        {order.items.length ? (
          order.items.map((i) => (
            <View key={i.medId} style={{ flexDirection: 'row', gap: 8 }}>
              <T w="bold" size={13.5} color={colors.white}>
                {i.qty}×
              </T>
              <T size={13.5} color={colors.navyText} style={{ flex: 1 }} numberOfLines={1}>
                {i.name}
              </T>
              {i.rx ? <T size={11} w="bold" color="#7EE0B0">Rx</T> : null}
            </View>
          ))
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <FileText size={16} color="#7EE0B0" />
            <T size={13.5} color={colors.navyText} style={{ flex: 1 }}>
              Customer uploaded a prescription. Build a quote from it.
            </T>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        <Button
          title={order.prescription ? 'Review prescription' : 'View & accept'}
          onPress={() => {
            dispatch({ type: 'MARK_SEEN', id: order.id });
            nav.replace(order.prescription ? 'RxQuote' : 'OrderDetail', { id: order.id });
          }}
        />
        <Button title="Later" variant="ghost" onPress={close} style={{ backgroundColor: 'transparent', borderColor: colors.navyLine }} />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------- Order detail */

export function OrderDetailScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const now = useNow();
  const { orders, dispatch } = usePartnerStore();
  const order = orders.find((o) => o.id === route.params?.id);
  const [rejecting, setRejecting] = useState(false);
  if (!order) return null;

  const accepted = !['new', 'rejected'].includes(order.status);
  const total = orderTotal(order);
  const commission = Math.round(total * COMMISSION.vendor);
  const call = (name: string, label: string) => nav.navigate('MaskedCall', { name, label });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title={order.code} subtitle={`Placed ${formatDayTime(order.placedAt, now)}`} right={<View style={{ paddingRight: 12 }}><OrderStatusPill status={order.status} reason={order.rejectReason} /></View>} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}>
        {order.status === 'new' ? (
          <View style={{ backgroundColor: colors.redSoft, borderRadius: radius.md, padding: 12 }}>
            <T w="bold" size={13} color={colors.redText}>
              Accept within {mmss(order.acceptBy - now)} or the order goes to another pharmacy.
            </T>
          </View>
        ) : null}
        {order.status === 'rejected' ? (
          <View style={{ backgroundColor: colors.surface2, borderRadius: radius.md, padding: 12 }}>
            <T w="bold" size={13} color={colors.ink2}>
              {order.rejectReason === 'Not accepted in time' ? 'Missed: not accepted in time' : `Rejected: ${order.rejectReason}`}
            </T>
          </View>
        ) : null}

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <T w="bold" size={15}>
                {order.customerName}
              </T>
              <T size={12.5} color={colors.muted} style={{ marginTop: 2 }} lh={18}>
                {accepted ? order.address : `${order.customerArea} · full address after you accept`}
              </T>
            </View>
            {accepted && order.status !== 'completed' ? (
              <Pressable accessibilityLabel="Call customer" onPress={() => call(order.customerName, 'Customer')} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} color={colors.teal} />
              </Pressable>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
            <T size={12} color={colors.ink2}>
              {order.distanceKm} km away
            </T>
            <T size={12} color={colors.ink2}>
              {order.payment}
            </T>
          </View>
        </View>

        {order.prescription ? (
          <View style={{ gap: 8 }}>
            <T w="bold" size={14}>
              Prescription
            </T>
            <RxPaper rx={order.prescription} patient={order.customerName} compact />
          </View>
        ) : null}

        {order.items.length ? (
          <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }}>
            <T w="bold" size={14} style={{ marginBottom: 6 }}>
              Items ({order.items.length})
            </T>
            {order.items.map((i) => (
              <View key={i.medId} style={{ flexDirection: 'row', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 10 }}>
                <T w="extrabold" size={13.5} style={{ width: 28 }}>
                  {i.qty}×
                </T>
                <View style={{ flex: 1 }}>
                  <T w="semibold" size={13.5} color={i.unavailable ? colors.faint : colors.ink} style={i.unavailable ? { textDecorationLine: 'line-through' } : undefined}>
                    {i.name}
                    {i.rx ? <T size={11} w="bold" color={service.medicine.fg}>{'  '}Rx</T> : null}
                  </T>
                  <T size={11.5} color={colors.muted}>
                    {i.unavailable ? (i.substitute ? `Substitute suggested: ${i.substitute}` : 'Not available, removed') : i.pack}
                  </T>
                </View>
                <T w="semibold" size={13.5} color={i.unavailable ? colors.faint : colors.ink}>
                  {rupees(i.qty * i.price)}
                </T>
              </View>
            ))}
            <InfoRow label="Delivery" value={order.deliveryFee ? rupees(order.deliveryFee) : 'Free'} />
            <InfoRow label="Order total" value={rupees(total)} bold />
            {order.status === 'completed' ? (
              <>
                <InfoRow label={`Lifeline commission (${COMMISSION.vendor * 100}%)`} value={`− ${rupees(commission)}`} />
                <InfoRow label="You earn" value={rupees(total - commission)} bold />
              </>
            ) : null}
          </View>
        ) : null}

        {order.status === 'ready' || order.status === 'completed' ? (
          <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.skySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={20} color={colors.sky} />
            </View>
            {order.rider ? (
              <View style={{ flex: 1 }}>
                <T w="bold" size={14}>
                  {order.rider.name}
                </T>
                <T size={12} color={colors.muted}>
                  {order.status === 'completed' ? `Picked up at ${formatTime(order.completedAt ?? now)}` : order.rider.vehicle}
                </T>
              </View>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color={colors.sky} />
                <T size={13} color={colors.ink2}>
                  Finding a rider near you…
                </T>
              </View>
            )}
            {order.rider && order.status === 'ready' ? (
              <Pressable accessibilityLabel="Call rider" onPress={() => call(order.rider!.name, 'Lifeline rider')} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={18} color={colors.teal} />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      {order.status === 'new' ? (
        <BottomBar>
          <Button title="Reject" variant="ghost" onPress={() => setRejecting(true)} style={{ flex: 1 }} />
          {order.prescription ? (
            <Button title="Build quote" onPress={() => nav.navigate('RxQuote', { id: order.id })} style={{ flex: 2 }} />
          ) : (
            <Button
              title="Accept order"
              onPress={() => {
                dispatch({ type: 'ACCEPT_ORDER', id: order.id });
                nav.replace('Packing', { id: order.id });
              }}
              style={{ flex: 2 }}
            />
          )}
        </BottomBar>
      ) : null}
      {order.status === 'quote_sent' ? (
        <BottomBar>
          <ActivityIndicator color={colors.teal} />
          <T size={13} color={colors.ink2} style={{ flex: 1 }} lh={18}>
            Quote of {rupees(total)} sent. Waiting for {order.customerName.split(' ')[0]} to confirm and pay.
          </T>
        </BottomBar>
      ) : null}
      {order.status === 'packing' ? (
        <BottomBar>
          <Button title="Open packing checklist" icon={<ClipboardList size={18} color={colors.white} />} onPress={() => nav.navigate('Packing', { id: order.id })} style={{ flex: 1 }} />
        </BottomBar>
      ) : null}
      {order.status === 'ready' ? (
        <BottomBar>
          <Button title={order.rider ? 'Hand over to rider' : 'Waiting for rider'} disabled={!order.rider} onPress={() => nav.navigate('Handover', { id: order.id })} style={{ flex: 1 }} />
        </BottomBar>
      ) : null}

      <ReasonSheet
        visible={rejecting}
        onClose={() => setRejecting(false)}
        title="Why are you rejecting?"
        reasons={REJECT_REASONS.vendor}
        confirmLabel="Reject order"
        onConfirm={(reason) => {
          dispatch({ type: 'REJECT_ORDER', id: order.id, reason, now: Date.now() });
          setRejecting(false);
        }}
      />
    </View>
  );
}

/* ------------------------------------------------------------- Order history */

export function OrderHistoryScreen() {
  const nav = useNavigation<any>();
  const now = useNow(30000);
  const { orders } = usePartnerStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'rejected'>('all');
  const [q, setQ] = useState('');
  const list = useMemo(
    () =>
      orders
        .filter((o) => (filter === 'all' ? o.status === 'completed' || o.status === 'rejected' : o.status === filter))
        .filter((o) => !q || `${o.code} ${o.customerName}`.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => (b.completedAt ?? b.placedAt) - (a.completedAt ?? a.placedAt)),
    [orders, filter, q],
  );
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Order history" />
      <View style={{ padding: 16, gap: 10, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: radius.md, backgroundColor: colors.surface2, paddingHorizontal: 12 }}>
          <Search size={18} color={colors.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search order ID or customer" placeholderTextColor={colors.faint} style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink }} />
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label="Handed over" active={filter === 'completed'} onPress={() => setFilter('completed')} />
          <Chip label="Rejected" active={filter === 'rejected'} onPress={() => setFilter('rejected')} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {list.length ? (
          list.map((o) => <OrderCard key={o.id} order={o} now={now} onPress={() => nav.navigate('OrderDetail', { id: o.id })} />)
        ) : (
          <EmptyState icon={<History size={28} color={colors.teal} />} title="No orders found" text="Try another search or filter." />
        )}
      </ScrollView>
    </View>
  );
}
