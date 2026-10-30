import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Camera, FileText, Image as ImageIcon, Minus, Phone, Plus, Search, ShoppingCart, Trash2, Upload } from 'lucide-react-native';
import T from '../components/T';
import { AppBar, Avatar, BottomBar, Button, EmptyState, IconButton, InfoRow, Section, StatusBadge, Timeline } from '../components/ui';
import { AddressSummary } from '../components/pickers';
import { ProductThumb } from '../components/brand';
import { colors, radius } from '../theme';
import { medCategories, medicines, medTint } from '../data/catalog';
import { useStore } from '../store/AppStore';
import { rupees } from '../utils/format';

function useCart() {
  const { medCart } = useStore();
  const items = Object.entries(medCart)
    .map(([id, qty]) => ({ m: medicines.find((x) => x.id === id)!, qty }))
    .filter((x) => x.m);
  const count = items.reduce((n, x) => n + x.qty, 0);
  const total = items.reduce((n, x) => n + x.qty * x.m.price, 0);
  const mrp = items.reduce((n, x) => n + x.qty * x.m.mrp, 0);
  const needsRx = items.some((x) => x.m.rx);
  return { items, count, total, mrp, needsRx };
}

function Stepper({ id }: { id: string }) {
  const { medCart, setCartQty } = useStore();
  const qty = medCart[id] ?? 0;
  if (!qty)
    return (
      <Pressable onPress={() => setCartQty(id, 1)} style={{ height: 34, paddingHorizontal: 18, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.teal, alignItems: 'center', justifyContent: 'center' }}>
        <T w="bold" size={13} color={colors.teal}>Add</T>
      </Pressable>
    );
  return (
    <View style={{ height: 34, flexDirection: 'row', alignItems: 'center', borderRadius: radius.sm, backgroundColor: colors.teal }}>
      <Pressable accessibilityLabel="Decrease" onPress={() => setCartQty(id, qty - 1)} style={{ width: 32, height: 34, alignItems: 'center', justifyContent: 'center' }}>
        <Minus size={15} color={colors.white} strokeWidth={2.6} />
      </Pressable>
      <T w="bold" size={13} color={colors.white} style={{ minWidth: 18, textAlign: 'center' }}>{qty}</T>
      <Pressable accessibilityLabel="Increase" onPress={() => setCartQty(id, qty + 1)} style={{ width: 32, height: 34, alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={15} color={colors.white} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

function CartButton({ navigation }: any) {
  const { count } = useCart();
  return (
    <IconButton label={`Cart, ${count} items`} onPress={() => navigation.navigate('Cart')}>
      <ShoppingCart size={21} color={colors.ink} />
      {count ? (
        <View style={{ position: 'absolute', top: 5, right: 4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
          <T w="bold" size={10} color={colors.white}>{count}</T>
        </View>
      ) : null}
    </IconButton>
  );
}

/* ----------------------------------------------------------------- Store */

export function MedicineStoreScreen({ navigation }: any) {
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const { count, total } = useCart();
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return medicines.filter((m) => (!cat || m.category === cat) && (!s || m.name.toLowerCase().includes(s)));
  }, [cat, q]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Medicines" subtitle="Delivered from partner pharmacies" border={false} right={<CartButton navigation={navigation} />} />
      <ScrollView stickyHeaderIndices={[1]} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ backgroundColor: colors.white, paddingHorizontal: 16, paddingBottom: 12, gap: 12 }}>
          <View style={{ height: 46, borderRadius: radius.md, backgroundColor: colors.surface2, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
            <Search size={18} color={colors.muted} />
            <TextInput value={q} onChangeText={setQ} placeholder="Search medicines and health products" placeholderTextColor={colors.faint} style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink }} />
          </View>
          <Pressable onPress={() => navigation.navigate('UploadPrescription')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: '#E2F5EA' }}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color={colors.green} />
            </View>
            <View style={{ flex: 1 }}>
              <T w="bold" size={14} color="#0E4A31">Order with prescription</T>
              <T size={12} color={colors.greenText}>Upload a photo, the pharmacist adds the medicines</T>
            </View>
            <Upload size={18} color={colors.green} />
          </Pressable>
        </View>
        <View style={{ backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}>
            <CatChip label="All" active={!cat} onPress={() => setCat(null)} />
            {medCategories.map((c) => (
              <CatChip key={c.id} label={c.label} active={cat === c.id} onPress={() => setCat(c.id)} />
            ))}
          </ScrollView>
        </View>
        <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {list.map((m) => (
            <Pressable key={m.id} onPress={() => navigation.navigate('ProductDetail', { id: m.id })} style={{ width: '48.5%', backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 12, gap: 8 }}>
              <View style={{ alignItems: 'center' }}>
                <ProductThumb tint={medTint(m.category)} size={84} />
              </View>
              {m.rx ? <T w="bold" size={10} color="#5B4BB7">Rx · prescription needed</T> : <T size={10} color={colors.muted}>{m.maker}</T>}
              <T w="bold" size={13} numberOfLines={2} lh={17} style={{ minHeight: 34 }}>{m.name}</T>
              <T size={11} color={colors.muted} numberOfLines={1}>{m.pack}</T>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <T w="extrabold" size={15}>{rupees(m.price)}</T>
                  {m.mrp > m.price ? <T size={11} color={colors.muted} style={{ textDecorationLine: 'line-through' }}>{rupees(m.mrp)}</T> : null}
                </View>
                <Stepper id={m.id} />
              </View>
            </Pressable>
          ))}
          {list.length === 0 ? <T size={13} color={colors.muted}>No products found.</T> : null}
        </View>
      </ScrollView>
      {count ? (
        <BottomBar>
          <View>
            <T size={12} color={colors.muted}>{count} item{count > 1 ? 's' : ''}</T>
            <T w="extrabold" size={18}>{rupees(total)}</T>
          </View>
          <Button title="View cart" style={{ flex: 1 }} onPress={() => navigation.navigate('Cart')} />
        </BottomBar>
      ) : null}
    </View>
  );
}

function CatChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ height: 34, paddingHorizontal: 14, borderRadius: 17, justifyContent: 'center', backgroundColor: active ? colors.ink : colors.white, borderWidth: active ? 0 : 1, borderColor: colors.lineStrong }}>
      <T w={active ? 'bold' : 'semibold'} size={12.5} color={active ? colors.white : colors.ink}>{label}</T>
    </Pressable>
  );
}

/* ---------------------------------------------------------- Product page */

export function ProductDetailScreen({ navigation, route }: any) {
  const m = medicines.find((x) => x.id === route.params.id)!;
  const { count } = useCart();
  const off = Math.round(((m.mrp - m.price) / m.mrp) * 100);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="" right={<CartButton navigation={navigation} />} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <View style={{ backgroundColor: colors.white, padding: 16, gap: 10 }}>
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <ProductThumb tint={medTint(m.category)} size={180} />
          </View>
          <T size={12} color={colors.muted}>{m.maker}</T>
          <T w="extrabold" size={20}>{m.name}</T>
          <T size={13} color={colors.ink2}>{m.pack}</T>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <T w="extrabold" size={22}>{rupees(m.price)}</T>
            {off > 0 ? (
              <>
                <T size={13} color={colors.muted} style={{ textDecorationLine: 'line-through' }}>MRP {rupees(m.mrp)}</T>
                <T w="bold" size={13} color={colors.green}>{off}% off</T>
              </>
            ) : null}
          </View>
          <T size={11} color={colors.muted}>Inclusive of all taxes</T>
          {m.rx ? (
            <View style={{ padding: 12, borderRadius: radius.md, backgroundColor: '#ECE9FB', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <FileText size={18} color="#5B4BB7" />
              <T w="semibold" size={12} color="#3A2E86" style={{ flex: 1 }}>A valid prescription is needed for this medicine. You can upload it at checkout.</T>
            </View>
          ) : null}
        </View>
        <Section title="About this product">
          <T size={13} color={colors.ink2} lh={20}>{m.about}</T>
        </Section>
        <Section title="Safety information">
          <T size={13} color={colors.ink2} lh={20}>Read the label before use. Keep out of reach of children. Consult your doctor if symptoms persist.</T>
        </Section>
      </ScrollView>
      <BottomBar>
        <Stepper id={m.id} />
        <Button title={count ? 'Go to cart' : 'Add to cart'} style={{ flex: 1 }} onPress={() => navigation.navigate('Cart')} />
      </BottomBar>
    </View>
  );
}

/* ------------------------------------------------------------------ Cart */

export function CartScreen({ navigation }: any) {
  const { items, count, total, mrp, needsRx } = useCart();
  const { rxUploaded, setCartQty, addresses, addressId } = useStore();
  const delivery = total >= 499 || total === 0 ? 0 : 40;
  const addr = addresses.find((a) => a.id === addressId);

  if (!count)
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <AppBar title="Cart" />
        <EmptyState icon={<ShoppingCart size={30} color={colors.teal} />} title="Your cart is empty" text="Add medicines or upload a prescription and the pharmacist will add them for you." action="Browse medicines" onAction={() => navigation.navigate('MedicineStore')} />
      </View>
    );

  const checkout = () => {
    const lines = [
      { label: `Item total (${count} items)`, amount: mrp },
      { label: 'Discount', amount: -(mrp - total) },
      { label: 'Delivery fee', amount: delivery },
    ];
    navigation.navigate('Checkout', {
      idPrefix: 'M',
      allowCash: true,
      draft: {
        service: 'medicine',
        title: `Medicine order · ${count} item${count > 1 ? 's' : ''}`,
        subtitle: 'Sri Sai Medicals',
        when: 'Arriving in about 2 hours',
        status: 'Confirmed',
        amount: total + delivery,
        meta: { items: items.map((x) => [x.m.id, x.qty]), step: 0, address: addr ? `${addr.line}, ${addr.area}` : '', rx: needsRx },
      },
      lines,
      total: total + delivery,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Cart" subtitle={`${count} item${count > 1 ? 's' : ''}`} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section padded>
          {items.map(({ m, qty }, i) => (
            <View key={m.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: i === items.length - 1 ? 0 : 1, borderBottomColor: '#EEF0EF' }}>
              <ProductThumb tint={medTint(m.category)} size={56} />
              <View style={{ flex: 1, gap: 2 }}>
                <T w="bold" size={14}>{m.name}</T>
                <T size={12} color={colors.muted}>{m.pack}</T>
                {m.rx ? <T w="bold" size={11} color="#5B4BB7">Prescription needed</T> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <T w="extrabold" size={14}>{rupees(m.price * qty)}</T>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <IconButton label="Remove" onPress={() => setCartQty(m.id, 0)} style={{ width: 34, height: 34 }}>
                      <Trash2 size={17} color={colors.muted} />
                    </IconButton>
                    <Stepper id={m.id} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Section>
        {needsRx ? (
          <Section title="Prescription">
            <Pressable onPress={() => navigation.navigate('UploadPrescription')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderStyle: rxUploaded ? 'solid' : 'dashed', borderColor: rxUploaded ? colors.green : '#B9AEF0', backgroundColor: rxUploaded ? colors.greenSoft : '#F6F4FE' }}>
              <FileText size={22} color={rxUploaded ? colors.green : '#5B4BB7'} />
              <View style={{ flex: 1 }}>
                <T w="bold" size={14}>{rxUploaded ? 'Prescription attached' : 'Upload prescription'}</T>
                <T size={12} color={colors.muted}>{rxUploaded ? 'The pharmacist will verify it before packing' : 'Needed for medicines marked Rx'}</T>
              </View>
              <T w="bold" size={13} color={colors.teal}>{rxUploaded ? 'Change' : 'Upload'}</T>
            </Pressable>
          </Section>
        ) : null}
        <Section title="Deliver to">
          <AddressSummary />
        </Section>
        <Section title="Bill summary">
          <InfoRow label="Item total (MRP)" value={rupees(mrp)} />
          <InfoRow label="Discount" value={'− ' + rupees(mrp - total)} />
          <InfoRow label="Delivery fee" value={delivery ? rupees(delivery) : 'Free'} />
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />
          <InfoRow label="To pay" value={rupees(total + delivery)} bold />
          {delivery ? <T size={12} color={colors.green} style={{ marginTop: 6 }}>Add {rupees(499 - total)} more for free delivery</T> : null}
        </Section>
      </ScrollView>
      <BottomBar>
        <View>
          <T size={12} color={colors.muted}>To pay</T>
          <T w="extrabold" size={18}>{rupees(total + delivery)}</T>
        </View>
        <Button title={needsRx && !rxUploaded ? 'Upload prescription' : 'Proceed to pay'} style={{ flex: 1 }} onPress={needsRx && !rxUploaded ? () => navigation.navigate('UploadPrescription') : checkout} />
      </BottomBar>
    </View>
  );
}

/* --------------------------------------------------- Upload prescription */

export function UploadPrescriptionScreen({ navigation }: any) {
  const { setRxUploaded, rxUploaded } = useStore();
  const [file, setFile] = useState<string | null>(rxUploaded ? 'prescription_photo.jpg' : null);
  const [busy, setBusy] = useState(false);
  const pick = (src: string) => {
    setBusy(true);
    // Camera and gallery access are added with the native picker; the demo attaches a sample file.
    setTimeout(() => {
      setFile(src === 'camera' ? 'camera_capture.jpg' : 'prescription_photo.jpg');
      setBusy(false);
    }, 700);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Upload prescription" />
      <ScrollView contentContainerStyle={{ gap: 8 }}>
        <Section>
          <T size={13} color={colors.ink2} lh={20}>Upload a clear photo of a valid prescription. It should show the doctor’s name, date, patient name and medicines.</T>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <Pressable onPress={() => pick('camera')} style={{ flex: 1, height: 96, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Camera size={26} color={colors.teal} />
              <T w="semibold" size={13}>Take photo</T>
            </Pressable>
            <Pressable onPress={() => pick('gallery')} style={{ flex: 1, height: 96, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <ImageIcon size={26} color={colors.teal} />
              <T w="semibold" size={13}>From gallery</T>
            </Pressable>
          </View>
          {busy ? <T size={13} color={colors.muted} style={{ marginTop: 14 }}>Attaching…</T> : null}
          {file && !busy ? (
            <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.greenSoft }}>
              <FileText size={20} color={colors.green} />
              <T w="semibold" size={13} style={{ flex: 1 }}>{file}</T>
              <Pressable onPress={() => setFile(null)}><T w="bold" size={13} color={colors.redText}>Remove</T></Pressable>
            </View>
          ) : null}
        </Section>
        <Section title="What happens next">
          <Timeline current={-1} steps={[{ title: 'Pharmacist reviews your prescription', note: 'Usually within 15 minutes' }, { title: 'Medicines are added to your cart', note: 'You confirm before paying' }, { title: 'Packed and delivered', note: 'Live tracking in the app' }]} />
        </Section>
      </ScrollView>
      <BottomBar>
        <Button title="Use this prescription" style={{ flex: 1 }} disabled={!file} onPress={() => { setRxUploaded(true); navigation.goBack(); }} />
      </BottomBar>
    </View>
  );
}

/* --------------------------------------------------------- Order tracking */

const ORDER_STEPS = [
  { title: 'Order placed', status: 'Confirmed', note: 'Sent to Sri Sai Medicals' },
  { title: 'Pharmacist verified', status: 'Preparing', note: 'Prescription and stock checked' },
  { title: 'Packed', status: 'Preparing', note: 'Ready for pickup' },
  { title: 'Out for delivery', status: 'Out for delivery', note: 'Ravi is on the way' },
  { title: 'Delivered', status: 'Delivered', note: 'Hand-delivered at your door' },
];

export function OrderTrackingScreen({ navigation, route }: any) {
  const { bookings, updateBooking, notify } = useStore();
  const b = bookings.find((x) => x.id === route.params.id);
  const step: number = b?.meta.step ?? 0;

  useEffect(() => {
    if (!b || b.status === 'Cancelled' || step >= ORDER_STEPS.length - 1) return;
    const t = setTimeout(() => {
      const next = step + 1;
      updateBooking(b.id, (x) => ({ status: ORDER_STEPS[next].status, meta: { ...x.meta, step: next }, when: next === 4 ? 'Delivered just now' : x.when }));
      if (next === 3 || next === 4) notify({ title: ORDER_STEPS[next].title, text: `Order ${b.id}`, service: 'medicine' });
    }, 6000);
    return () => clearTimeout(t);
  }, [b, step, updateBooking, notify]);

  if (!b) return null;
  const items: [string, number][] = b.meta.items ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar title="Track order" subtitle={b.id} />
      <ScrollView contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Section>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <T w="extrabold" size={20}>{b.status === 'Cancelled' ? 'Order cancelled' : ORDER_STEPS[step].title}</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>{step >= 4 ? 'Thanks for ordering with Lifeline 360' : 'Estimated arrival in about 2 hours'}</T>
            </View>
            <StatusBadge status={b.status} />
          </View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.line, marginTop: 14 }}>
            <View style={{ width: `${(step / 4) * 100}%`, height: 6, borderRadius: 3, backgroundColor: colors.green }} />
          </View>
        </Section>
        {step === 3 ? (
          <Section title="Delivery partner">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar name="Ravi Kumar" size={48} />
              <View style={{ flex: 1 }}>
                <T w="bold" size={15}>Ravi Kumar</T>
                <T size={12} color={colors.muted}>Calls use a masked number</T>
              </View>
              <Button title="Call" size="sm" icon={<Phone size={15} color={colors.white} />} onPress={() => navigation.navigate('Call', { name: 'Ravi Kumar', role: 'Delivery partner' })} />
            </View>
          </Section>
        ) : null}
        <Section title="Order status">
          <Timeline steps={ORDER_STEPS} current={b.status === 'Cancelled' ? -1 : step >= 4 ? 5 : step} />
        </Section>
        <Section title="Items">
          {items.map(([id, qty]) => {
            const m = medicines.find((x) => x.id === id);
            if (!m) return null;
            return <InfoRow key={id} label={`${qty} × ${m.name}`} value={rupees(m.price * qty)} />;
          })}
          <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />
          <InfoRow label={b.meta.method === 'cash' ? 'Pay on delivery' : 'Paid'} value={rupees(b.amount)} bold />
        </Section>
        {step < 2 && b.status !== 'Cancelled' ? (
          <Section>
            <Button
              title="Cancel order"
              variant="ghost"
              onPress={() =>
                Alert.alert('Cancel order?', 'You can cancel until the order is packed.', [
                  { text: 'Keep order', style: 'cancel' },
                  { text: 'Cancel order', style: 'destructive', onPress: () => updateBooking(b.id, { status: 'Cancelled' }) },
                ])
              }
            />
          </Section>
        ) : null}
      </ScrollView>
    </View>
  );
}
