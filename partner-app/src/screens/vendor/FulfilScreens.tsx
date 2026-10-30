import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Bike, CheckCircle2, Minus, Phone, Plus, Search, Sparkles, X } from 'lucide-react-native';
import { AppBar, BottomBar, Button, CheckBox, ProductThumb, T, colors, radius, rupees, service } from '../../ui';
import { orderTotal, usePartnerStore } from '../../store/PartnerStore';
import { Medicine, OrderItem } from '../../store/types';
import { OtpBoxes, RxPaper, Sheet } from '../../components/partner';
import { tintFor } from '../../data/seed';

const toItem = (m: Medicine, qty: number): OrderItem => ({
  medId: m.id, name: m.name, pack: m.pack, qty, price: m.price, rx: m.rx, packed: false, unavailable: false,
});

/** Catalogue matches for the brand names written on a prescription. */
function suggestFromRx(lines: string[], catalogue: Medicine[]): Medicine[] {
  return catalogue.filter((m) => m.inStock && m.stock > 0 && lines.some((l) => l.toLowerCase().includes(m.name.split(' ')[0].toLowerCase())));
}

/* --------------------------------------------------------- Rx quote builder */

export function RxQuoteScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { orders, catalogue, dispatch } = usePartnerStore();
  const order = orders.find((o) => o.id === route.params?.id);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [q, setQ] = useState('');
  const [rxOpen, setRxOpen] = useState(true);

  const suggestions = useMemo(() => (order?.prescription ? suggestFromRx(order.prescription.lines, catalogue) : []), [order, catalogue]);
  const results = q.trim().length >= 2 ? catalogue.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6) : [];
  if (!order || !order.prescription) return null;

  const add = (m: Medicine) =>
    setItems((cur) => (cur.some((i) => i.medId === m.id) ? cur.map((i) => (i.medId === m.id ? { ...i, qty: i.qty + 1 } : i)) : [...cur, toItem(m, 1)]));
  const setQty = (id: string, d: number) =>
    setItems((cur) => cur.flatMap((i) => (i.medId !== id ? [i] : i.qty + d <= 0 ? [] : [{ ...i, qty: i.qty + d }])));
  const pending = suggestions.filter((m) => !items.some((i) => i.medId === m.id));
  const total = orderTotal({ items, deliveryFee: 0 });

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Build quote" subtitle={`${order.code} · ${order.customerName}`} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}>
        <View>
          <Pressable onPress={() => setRxOpen((v) => !v)} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <T w="bold" size={14}>
              Prescription
            </T>
            <T w="bold" size={13} color={colors.teal}>
              {rxOpen ? 'Hide' : 'Show'}
            </T>
          </Pressable>
          {rxOpen ? <RxPaper rx={order.prescription} patient={order.customerName} compact /> : null}
        </View>

        {pending.length ? (
          <View style={{ backgroundColor: service.medicine.bg, borderRadius: radius.md, padding: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} color={service.medicine.text} />
              <T w="bold" size={13} color={service.medicine.text} style={{ flex: 1 }}>
                {pending.length} matching medicines in your stock
              </T>
              <T
                w="bold"
                size={13}
                color={colors.teal}
                onPress={() => setItems((cur) => [...cur, ...pending.map((m) => toItem(m, m.category === 'heart' || m.category === 'diabetes' ? 2 : 1))])}>
                Add all
              </T>
            </View>
            <T size={12} color={service.medicine.text}>
              {pending.map((m) => m.name).join(' · ')}
            </T>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: radius.md, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.lineStrong, paddingHorizontal: 12 }}>
          <Search size={18} color={colors.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search your catalogue" placeholderTextColor={colors.faint} style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink }} />
          {q ? (
            <Pressable onPress={() => setQ('')} accessibilityLabel="Clear search">
              <X size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
        {results.length ? (
          <View style={{ backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line }}>
            {results.map((m, i) => {
              const out = !m.inStock || m.stock === 0;
              return (
                <Pressable key={m.id} disabled={out} onPress={() => { add(m); setQ(''); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line, opacity: out ? 0.5 : 1 }}>
                  <View style={{ flex: 1 }}>
                    <T w="semibold" size={13.5}>{m.name}</T>
                    <T size={11.5} color={colors.muted}>{m.pack} · {out ? 'Out of stock' : `${m.stock} in stock`}</T>
                  </View>
                  <T w="bold" size={13.5}>{rupees(m.price)}</T>
                  {!out ? <Plus size={18} color={colors.teal} /> : null}
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }}>
          <T w="bold" size={14} style={{ marginBottom: 4 }}>
            Quote ({items.length})
          </T>
          {items.length ? (
            items.map((i) => (
              <View key={i.medId} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line }}>
                <View style={{ flex: 1 }}>
                  <T w="semibold" size={13.5}>{i.name}</T>
                  <T size={11.5} color={colors.muted}>{rupees(i.price)} · {i.pack}</T>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.lineStrong, borderRadius: 8 }}>
                  <Pressable accessibilityLabel="Decrease" onPress={() => setQty(i.medId, -1)} style={{ padding: 8 }}>
                    <Minus size={14} color={colors.ink} />
                  </Pressable>
                  <T w="bold" size={13.5} style={{ minWidth: 20, textAlign: 'center' }}>{i.qty}</T>
                  <Pressable accessibilityLabel="Increase" onPress={() => setQty(i.medId, 1)} style={{ padding: 8 }}>
                    <Plus size={14} color={colors.ink} />
                  </Pressable>
                </View>
                <T w="bold" size={13.5} style={{ width: 62, textAlign: 'right' }}>{rupees(i.qty * i.price)}</T>
              </View>
            ))
          ) : (
            <T size={13} color={colors.muted} style={{ paddingVertical: 10 }}>
              Add the medicines written on the prescription.
            </T>
          )}
        </View>
      </ScrollView>
      <BottomBar>
        <View style={{ flex: 1 }}>
          <T size={12} color={colors.muted}>Quote total</T>
          <T w="extrabold" size={18}>{rupees(total)}</T>
        </View>
        <Button
          title="Send quote"
          disabled={!items.length}
          onPress={() => {
            dispatch({ type: 'SEND_QUOTE', id: order.id, items, now: Date.now() });
            nav.replace('OrderDetail', { id: order.id });
          }}
          style={{ flex: 1.4 }}
        />
      </BottomBar>
    </View>
  );
}

/* --------------------------------------------------------- Packing checklist */

export function PackingScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { orders, catalogue, dispatch } = usePartnerStore();
  const order = orders.find((o) => o.id === route.params?.id);
  const [swapFor, setSwapFor] = useState<OrderItem | null>(null);
  if (!order) return null;

  const live = order.items.filter((i) => !i.unavailable);
  const packed = live.filter((i) => i.packed).length;
  const ready = live.length > 0 && packed === live.length;
  const swapMed = swapFor ? catalogue.find((m) => m.id === swapFor.medId) : undefined;
  const substitutes = swapMed ? catalogue.filter((m) => m.category === swapMed.category && m.id !== swapMed.id && m.inStock && m.stock > 0) : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Packing" subtitle={`${order.code} · ${packed} of ${live.length} packed`} />
      <View style={{ height: 4, backgroundColor: colors.line }}>
        <View style={{ height: 4, width: `${live.length ? (packed / live.length) * 100 : 0}%`, backgroundColor: colors.green }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <T size={12.5} color={colors.muted} lh={18}>
          Tick each item as it goes into the bag. Check the batch and expiry on every strip.
        </T>
        {order.items.map((i) => {
          const m = catalogue.find((x) => x.id === i.medId);
          return (
            <View key={i.medId} style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: i.packed ? colors.green : colors.line, padding: 12, opacity: i.unavailable ? 0.6 : 1 }}>
              <Pressable disabled={i.unavailable} onPress={() => dispatch({ type: 'TOGGLE_PACKED', id: order.id, medId: i.medId })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ProductThumb tint={tintFor(m?.category ?? '')} size={48} />
                <View style={{ flex: 1 }}>
                  <T w="bold" size={14} style={i.unavailable ? { textDecorationLine: 'line-through' } : undefined}>
                    {i.qty} × {i.name}
                  </T>
                  <T size={12} color={colors.muted}>
                    {i.pack}
                    {i.rx ? ' · Rx' : ''}
                  </T>
                </View>
                {!i.unavailable ? <CheckBox on={i.packed} /> : null}
              </Pressable>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                {i.unavailable ? (
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <T size={12} color={colors.amberText} style={{ flex: 1 }}>
                      {i.substitute ? `Suggested ${i.substitute} to the customer` : 'Removed from the order'}
                    </T>
                    <T w="bold" size={12.5} color={colors.teal} onPress={() => dispatch({ type: 'SET_UNAVAILABLE', id: order.id, medId: i.medId, unavailable: false })}>
                      Undo
                    </T>
                  </View>
                ) : (
                  <T w="bold" size={12.5} color={colors.redText} onPress={() => setSwapFor(i)}>
                    Not available?
                  </T>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <BottomBar>
        <Button
          title={ready ? 'Packed · ready for pickup' : `Pack ${live.length - packed} more`}
          disabled={!ready}
          onPress={() => {
            dispatch({ type: 'MARK_READY', id: order.id, now: Date.now() });
            nav.replace('OrderDetail', { id: order.id });
          }}
          style={{ flex: 1 }}
        />
      </BottomBar>

      <Sheet visible={!!swapFor} onClose={() => setSwapFor(null)} title={swapFor ? `${swapFor.name} not available` : ''}>
        <T size={13} color={colors.muted} lh={19} style={{ marginBottom: 8 }}>
          Suggest a substitute from the same category, or remove the item. The customer is refunded for removed items.
        </T>
        {substitutes.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => {
              if (!swapFor) return;
              dispatch({ type: 'SET_UNAVAILABLE', id: order.id, medId: swapFor.medId, unavailable: true, substitute: m.name });
              setSwapFor(null);
            }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <View style={{ flex: 1 }}>
              <T w="semibold" size={14}>{m.name}</T>
              <T size={12} color={colors.muted}>{m.pack} · {m.stock} in stock</T>
            </View>
            <T w="bold" size={13.5}>{rupees(m.price)}</T>
          </Pressable>
        ))}
        <Button
          title="Remove item from order"
          variant="ghost"
          onPress={() => {
            if (!swapFor) return;
            dispatch({ type: 'SET_UNAVAILABLE', id: order.id, medId: swapFor.medId, unavailable: true });
            setSwapFor(null);
          }}
          style={{ marginTop: 14 }}
        />
      </Sheet>
    </View>
  );
}

/* ---------------------------------------------------------------- Handover */

export function HandoverScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { orders, dispatch } = usePartnerStore();
  const order = orders.find((o) => o.id === route.params?.id);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  if (!order || !order.rider) return null;

  if (order.status === 'completed') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white, padding: 24, justifyContent: 'center' }}>
        <View style={{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
          <CheckCircle2 size={40} color={colors.green} />
        </View>
        <T w="extrabold" size={22} center style={{ marginTop: 18 }}>
          Handed over
        </T>
        <T size={14} color={colors.muted} center lh={21} style={{ marginTop: 8 }}>
          {order.rider.name} is on the way to {order.customerName}. {rupees(orderTotal(order))} has been added to your earnings.
        </T>
        <Button title="Back to orders" onPress={() => nav.navigate('VendorTabs', { screen: 'VendorOrders' })} style={{ marginTop: 28 }} />
      </View>
    );
  }

  const verify = (v: string) => {
    if (v.length < 4) return;
    if (v === order.handoverOtp) {
      dispatch({ type: 'HANDOVER', id: order.id, now: Date.now() });
    } else {
      setError(true);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Hand over" subtitle={order.code} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.skySoft, alignItems: 'center', justifyContent: 'center' }}>
            <Bike size={22} color={colors.sky} />
          </View>
          <View style={{ flex: 1 }}>
            <T w="bold" size={15}>{order.rider.name}</T>
            <T size={12.5} color={colors.muted}>{order.rider.vehicle}</T>
          </View>
          <Pressable accessibilityLabel="Call rider" onPress={() => nav.navigate('MaskedCall', { name: order.rider!.name, label: 'Lifeline rider' })} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.tealTint, alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={18} color={colors.teal} />
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 18, gap: 16 }}>
          <View>
            <T w="bold" size={16} center>
              Enter the rider’s pickup code
            </T>
            <T size={13} color={colors.muted} center style={{ marginTop: 4 }} lh={19}>
              Ask the rider for the 4-digit code in their app before handing over the bag.
            </T>
          </View>
          <OtpBoxes
            value={code}
            error={error}
            onChange={(v) => {
              setCode(v);
              setError(false);
              verify(v);
            }}
          />
          {error ? (
            <T size={12.5} color={colors.redText} center>
              That code doesn’t match. Check with the rider.
            </T>
          ) : null}
          <T size={12} color={colors.faint} center>
            Demo pickup code: {order.handoverOtp}
          </T>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
          <T size={13} color={colors.ink2}>{order.items.filter((i) => !i.unavailable).length} items · {order.payment}</T>
          <T w="bold" size={13}>{rupees(orderTotal(order))}</T>
        </View>
      </ScrollView>
    </View>
  );
}
