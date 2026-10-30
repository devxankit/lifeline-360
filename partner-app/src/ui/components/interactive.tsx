import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import T from './T';
import { colors, radius } from '../theme';

/* -------------------------------------------------------- CountdownRing */

export function CountdownRing({
  seconds,
  maxSeconds = 30,
  size = 110,
  stroke = 7,
}: {
  seconds: number;
  maxSeconds?: number;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, seconds / maxSeconds));
  const dashOffset = circ * (1 - progress);
  const ringColor = seconds <= 8 ? colors.red : seconds <= 15 ? colors.amber : colors.teal;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.navySurface}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <T w="extrabold" size={32} color={colors.white}>
          {seconds}
        </T>
        <T size={10} color={colors.navyMuted} w="bold">
          SEC
        </T>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------ StatTile */

export function StatTile({
  label,
  value,
  sublabel,
  icon,
  dark,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon?: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: dark ? colors.navySurface : colors.surface2,
        borderRadius: radius.md,
        padding: 12,
        borderWidth: 1,
        borderColor: dark ? colors.navyLine : colors.line,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <T size={11} color={dark ? colors.navyMuted : colors.muted} w="semibold">
          {label.toUpperCase()}
        </T>
        {icon}
      </View>
      <T w="extrabold" size={18} color={dark ? colors.white : colors.ink}>
        {value}
      </T>
      {sublabel ? (
        <T size={10} color={dark ? colors.navyMuted : colors.faint} style={{ marginTop: 2 }}>
          {sublabel}
        </T>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------ BarChart */

export function BarChart({
  data,
  height = 140,
}: {
  data: { label: string; amount: number; active?: boolean }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 10 }}>
      {data.map((item, idx) => {
        const barHeight = Math.max(12, (item.amount / max) * (height - 36));
        return (
          <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
            <T size={10} color={item.active ? colors.teal : colors.faint} w={item.active ? 'bold' : 'regular'} style={{ marginBottom: 4 }}>
              {item.amount > 0 ? `₹${Math.round(item.amount / 100) * 100}` : '0'}
            </T>
            <View
              style={{
                width: 22,
                height: barHeight,
                backgroundColor: item.active ? colors.teal : colors.surface2,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                borderWidth: item.active ? 0 : 1,
                borderColor: colors.lineStrong,
              }}
            />
            <T size={11} color={item.active ? colors.teal : colors.muted} w={item.active ? 'bold' : 'semibold'} style={{ marginTop: 6 }}>
              {item.label}
            </T>
          </View>
        );
      })}
    </View>
  );
}
