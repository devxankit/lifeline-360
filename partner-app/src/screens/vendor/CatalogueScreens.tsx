import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowDown, ArrowUp, Eye, EyeOff, Package, Pencil, Plus, Search, Tags } from 'lucide-react-native';
import { AppBar, Badge, BottomBar, Button, Chip, EmptyState, Field, ProductThumb, T, Toggle, colors, radius, rupees } from '../../ui';
import { isLowStock, usePartnerStore } from '../../store/PartnerStore';
import { Medicine } from '../../store/types';
import { Sheet, TabHeader } from '../../components/partner';
import { tintFor } from '../../data/seed';

/* ---------------------------------------------------------------- Catalogue */

type Filter = 'all' | 'low' | 'out' | string;

export function VendorCatalogueScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { catalogue, categories, dispatch } = usePartnerStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  // The dashboard's low-stock card opens this tab pre-filtered.
  useEffect(() => {
    if (route.params?.filter) {
      setFilter(route.params.filter);
      nav.setParams({ filter: undefined });
    }
  }, [route.params?.filter, nav]);

  const visible = categories.filter((c) => !c.hidden);
  const list = catalogue
    .filter((m) =>
      filter === 'all' ? true : filter === 'low' ? isLowStock(m) || !m.inStock || m.stock === 0 : filter === 'out' ? !m.inStock || m.stock === 0 : m.category === filter,
    )
    .filter((m) => !q || `${m.name} ${m.maker}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <TabHeader
        title="Catalogue"
        subtitle={`${catalogue.length} medicines · ${catalogue.filter((m) => m.inStock && m.stock > 0).length} in stock`}
        right={
          <Pressable accessibilityLabel="Categories" onPress={() => nav.navigate('Categories')} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Tags size={21} color={colors.ink} />
          </Pressable>
        }
      />
      <View style={{ backgroundColor: colors.white, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, height: 44, borderRadius: radius.md, backgroundColor: colors.surface2, paddingHorizontal: 12 }}>
          <Search size={18} color={colors.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search medicine or brand" placeholderTextColor={colors.faint} style={{ flex: 1, fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: colors.ink }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <Chip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
          <Chip label="Low stock" active={filter === 'low'} onPress={() => setFilter('low')} />
          <Chip label="Out of stock" active={filter === 'out'} onPress={() => setFilter('out')} />
          {visible.map((c) => (
            <Chip key={c.id} label={c.label} active={filter === c.id} onPress={() => setFilter(c.id)} />
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        {list.length ? (
          <View style={{ backgroundColor: colors.white }}>
            {list.map((m) => (
              <MedicineRow key={m.id} m={m} onPress={() => nav.navigate('MedicineForm', { id: m.id })} onToggle={(v) => dispatch({ type: 'SET_IN_STOCK', id: m.id, inStock: v })} />
            ))}
          </View>
        ) : (
          <EmptyState icon={<Package size={28} color={colors.teal} />} title="No medicines found" text="Try another search, or add the medicine to your catalogue." action="Add medicine" onAction={() => nav.navigate('MedicineForm')} />
        )}
      </ScrollView>
      <Pressable
        accessibilityLabel="Add medicine"
        onPress={() => nav.navigate('MedicineForm')}
        style={({ pressed }) => ({ position: 'absolute', right: 16, bottom: 16, height: 50, paddingHorizontal: 18, borderRadius: 25, backgroundColor: colors.teal, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 4, opacity: pressed ? 0.85 : 1 })}>
        <Plus size={20} color={colors.white} />
        <T w="bold" size={14} color={colors.white}>
          Add medicine
        </T>
      </Pressable>
    </View>
  );
}

function MedicineRow({ m, onPress, onToggle }: { m: Medicine; onPress: () => void; onToggle: (v: boolean) => void }) {
  const out = !m.inStock || m.stock === 0;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line, opacity: pressed ? 0.7 : 1 })}>
      <ProductThumb tint={tintFor(m.category)} size={50} />
      <View style={{ flex: 1 }}>
        <T w="bold" size={14} numberOfLines={1}>
          {m.name}
        </T>
        <T size={12} color={colors.muted} numberOfLines={1}>
          {m.pack} · {m.maker}
        </T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <T w="bold" size={13}>
            {rupees(m.price)}
          </T>
          {m.mrp > m.price ? (
            <T size={11.5} color={colors.faint} style={{ textDecorationLine: 'line-through' }}>
              {rupees(m.mrp)}
            </T>
          ) : null}
          {out ? <Badge label="Out of stock" variant="error" /> : isLowStock(m) ? <Badge label={`${m.stock} left`} variant="warning" /> : <T size={11.5} color={colors.muted}>{m.stock} in stock</T>}
          {m.rx ? <Badge label="Rx" variant="neutral" /> : null}
        </View>
      </View>
      <Switch
        accessibilityLabel={`${m.name} available`}
        value={m.inStock && m.stock > 0}
        disabled={m.stock === 0}
        onValueChange={onToggle}
        trackColor={{ true: colors.teal, false: '#C9CECC' }}
        thumbColor={colors.white}
      />
    </Pressable>
  );
}

/* -------------------------------------------------------- Add / edit medicine */

export function MedicineFormScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const { catalogue, categories, dispatch } = usePartnerStore();
  const existing = catalogue.find((m) => m.id === route.params?.id);

  const [name, setName] = useState(existing?.name ?? '');
  const [maker, setMaker] = useState(existing?.maker ?? '');
  const [pack, setPack] = useState(existing?.pack ?? '');
  const [category, setCategory] = useState(existing?.category ?? categories[0]?.id ?? '');
  const [mrp, setMrp] = useState(existing ? String(existing.mrp) : '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [stock, setStock] = useState(existing ? String(existing.stock) : '');
  const [lowAt, setLowAt] = useState(existing ? String(existing.lowStockAt) : '10');
  const [rx, setRx] = useState(existing?.rx ?? false);
  const [inStock, setInStock] = useState(existing?.inStock ?? true);

  const nMrp = Number(mrp);
  const nPrice = Number(price);
  const priceError = price && mrp && nPrice > nMrp ? 'Selling price can’t be more than MRP' : undefined;
  const valid = name.trim() && maker.trim() && pack.trim() && category && nMrp > 0 && nPrice > 0 && !priceError && stock !== '';

  const save = () => {
    if (!valid) return;
    const s = Number(stock) || 0;
    dispatch({
      type: 'UPSERT_MEDICINE',
      medicine: {
        id: existing?.id ?? `m-${Date.now()}`,
        name: name.trim(),
        maker: maker.trim(),
        pack: pack.trim(),
        category,
        mrp: nMrp,
        price: nPrice,
        stock: s,
        lowStockAt: Number(lowAt) || 0,
        rx,
        inStock: inStock && s > 0,
      },
    });
    nav.goBack();
  };

  const digits = (fn: (v: string) => void) => (t: string) => fn(t.replace(/\D/g, ''));

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: colors.white }}>
      <AppBar title={existing ? 'Edit medicine' : 'Add medicine'} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Field label="Medicine name" placeholder="e.g. Dolo 650 Tablet" value={name} onChangeText={setName} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Field label="Manufacturer" value={maker} onChangeText={setMaker} style={{ flex: 1 }} />
          <Field label="Pack" placeholder="Strip of 15" value={pack} onChangeText={setPack} style={{ flex: 1 }} />
        </View>
        <View style={{ gap: 8 }}>
          <T w="semibold" size={13} color={colors.ink2}>
            Category
          </T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {categories.map((c) => (
              <Chip key={c.id} label={c.label} active={category === c.id} onPress={() => setCategory(c.id)} />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Field label="MRP (₹)" value={mrp} onChangeText={digits(setMrp)} keyboardType="number-pad" style={{ flex: 1 }} />
          <Field label="Selling price (₹)" value={price} onChangeText={digits(setPrice)} keyboardType="number-pad" style={{ flex: 1 }} error={priceError} />
        </View>
        {nMrp > 0 && nPrice > 0 && !priceError ? (
          <T size={12} color={colors.greenText} style={{ marginTop: -6 }}>
            {Math.round(((nMrp - nPrice) / nMrp) * 100)}% off MRP for the customer
          </T>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Field label="Stock (units)" value={stock} onChangeText={digits(setStock)} keyboardType="number-pad" style={{ flex: 1 }} />
          <Field label="Alert when below" value={lowAt} onChangeText={digits(setLowAt)} keyboardType="number-pad" style={{ flex: 1 }} />
        </View>
        <View style={{ borderWidth: 1, borderColor: colors.line, borderRadius: radius.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.line }}>
            <View style={{ flex: 1 }}>
              <T w="semibold" size={14}>Prescription required</T>
              <T size={12} color={colors.muted}>Customers must upload an Rx to order</T>
            </View>
            <Toggle label="Prescription required" value={rx} onChange={setRx} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
            <View style={{ flex: 1 }}>
              <T w="semibold" size={14}>Available to order</T>
              <T size={12} color={colors.muted}>Turn off to hide it without deleting</T>
            </View>
            <Toggle label="Available to order" value={inStock} onChange={setInStock} />
          </View>
        </View>
      </ScrollView>
      <BottomBar>
        <Button title={existing ? 'Save changes' : 'Add to catalogue'} disabled={!valid} onPress={save} style={{ flex: 1 }} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

/* --------------------------------------------------------------- Categories */

export function CategoriesScreen() {
  const { categories, catalogue, dispatch } = usePartnerStore();
  const [editing, setEditing] = useState<{ id?: string; label: string } | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar
        title="Categories"
        right={
          <Pressable accessibilityLabel="Add category" onPress={() => setEditing({ label: '' })} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={22} color={colors.teal} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <T size={12.5} color={colors.muted} lh={18}>
          This order is how categories appear to customers in the User app. Hidden categories stay in your catalogue but aren’t shown.
        </T>
        <View style={{ backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line }}>
          {categories.map((c, i) => (
            <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 14, paddingRight: 4, paddingVertical: 6, borderTopWidth: i ? 1 : 0, borderTopColor: colors.line }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tintFor(c.id).fg, marginRight: 12, opacity: c.hidden ? 0.3 : 1 }} />
              <View style={{ flex: 1 }}>
                <T w="semibold" size={14} color={c.hidden ? colors.faint : colors.ink}>
                  {c.label}
                </T>
                <T size={11.5} color={colors.muted}>
                  {catalogue.filter((m) => m.category === c.id).length} medicines{c.hidden ? ' · hidden' : ''}
                </T>
              </View>
              <IconBtn label="Move up" disabled={i === 0} onPress={() => dispatch({ type: 'MOVE_CATEGORY', id: c.id, dir: -1 })}>
                <ArrowUp size={17} color={i === 0 ? colors.lineStrong : colors.ink2} />
              </IconBtn>
              <IconBtn label="Move down" disabled={i === categories.length - 1} onPress={() => dispatch({ type: 'MOVE_CATEGORY', id: c.id, dir: 1 })}>
                <ArrowDown size={17} color={i === categories.length - 1 ? colors.lineStrong : colors.ink2} />
              </IconBtn>
              <IconBtn label={c.hidden ? 'Show' : 'Hide'} onPress={() => dispatch({ type: 'TOGGLE_CATEGORY', id: c.id })}>
                {c.hidden ? <EyeOff size={17} color={colors.faint} /> : <Eye size={17} color={colors.ink2} />}
              </IconBtn>
              <IconBtn label="Rename" onPress={() => setEditing({ id: c.id, label: c.label })}>
                <Pencil size={16} color={colors.ink2} />
              </IconBtn>
            </View>
          ))}
        </View>
      </ScrollView>
      <Sheet visible={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Rename category' : 'New category'}>
        {editing ? (
          <>
            <Field value={editing.label} onChangeText={(t) => setEditing({ ...editing, label: t })} placeholder="Category name" autoFocus />
            <Button
              title="Save"
              disabled={!editing.label.trim()}
              onPress={() => {
                const label = editing.label.trim();
                if (editing.id) dispatch({ type: 'RENAME_CATEGORY', id: editing.id, label });
                else dispatch({ type: 'ADD_CATEGORY', label, now: Date.now() });
                setEditing(null);
              }}
              style={{ marginTop: 14 }}
            />
          </>
        ) : null}
      </Sheet>
    </View>
  );
}

function IconBtn({ children, onPress, label, disabled }: { children: React.ReactNode; onPress: () => void; label: string; disabled?: boolean }) {
  return (
    <Pressable accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ width: 38, height: 40, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.5 : 1 })}>
      {children}
    </Pressable>
  );
}
