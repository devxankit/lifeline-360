import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Rect, Text as SvgText } from 'react-native-svg';
import { ChevronRight, Power, ShieldAlert, CheckCircle2, Clock } from 'lucide-react-native';
import T from './T';
import { colors, radius, shadow } from '../theme';
import { rupees } from '../utils/format';

/* -------------------------------------------------------- SwipeToConfirm */

export function SwipeToConfirm({
  title = 'SWIPE TO ACCEPT',
  onConfirm,
  color = colors.teal,
  textColor = colors.white,
  disabled,
}: {
  title: string;
  onConfirm: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
}) {
  const [containerWidth, setContainerWidth] = useState(300);
  const pan = useRef(new Animated.Value(0)).current;
  const knobSize = 50;
  const maxDrag = Math.max(0, containerWidth - knobSize - 8);

  // The responder is created once, so it reads the latest props through refs;
  // otherwise it would keep calling the onConfirm from the first render.
  const latest = useRef({ onConfirm, maxDrag, disabled });
  latest.current = { onConfirm, maxDrag, disabled };
  const busy = useRef(false);

  // A new step gets a fresh slider.
  useEffect(() => {
    pan.stopAnimation();
    pan.setValue(0);
    busy.current = false;
  }, [title, pan]);

  const finish = (dx: number) => {
    const max = latest.current.maxDrag;
    if (dx >= max * 0.75) {
      busy.current = true;
      Animated.timing(pan, { toValue: max, duration: 150, useNativeDriver: true }).start(() => {
        latest.current.onConfirm();
        setTimeout(() => {
          pan.setValue(0);
          busy.current = false;
        }, 600);
      });
    } else {
      Animated.spring(pan, { toValue: 0, bounciness: 12, useNativeDriver: true }).start();
    }
  };

  // The whole track takes the drag, so the knob can never get stranded out of reach.
  // If the system interrupts the gesture, it is settled exactly like a release.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled && !busy.current,
      onMoveShouldSetPanResponder: (_, g) => !latest.current.disabled && !busy.current && Math.abs(g.dx) > 4,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.stopAnimation();
        pan.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        pan.setValue(Math.max(0, Math.min(g.dx, latest.current.maxDrag)));
      },
      onPanResponderRelease: (_, g) => finish(g.dx),
      onPanResponderTerminate: (_, g) => finish(g.dx),
    }),
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{
        height: 58,
        backgroundColor: colors.navySurface,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: color,
        justifyContent: 'center',
        paddingHorizontal: 4,
        overflow: 'hidden',
        opacity: disabled ? 0.5 : 1,
      }}>
      <View style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
        <T w="extrabold" size={14} color={textColor} style={{ letterSpacing: 1.2 }}>
          {title}
        </T>
      </View>
      <Animated.View
        style={{
          transform: [{ translateX: pan }],
          width: knobSize,
          height: knobSize,
          borderRadius: knobSize / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadow.raised,
        }}
        >
        <ChevronRight size={26} color={colors.white} strokeWidth={2.8} />
      </Animated.View>
    </View>
  );
}

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

/* -------------------------------------------------------- OnlineToggle */

export function OnlineToggle({
  isOnline,
  onToggle,
  disabled,
}: {
  isOnline: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isOnline ? colors.greenSoft : colors.surface2,
          borderRadius: radius.pill,
          borderWidth: 1.5,
          borderColor: isOnline ? colors.green : colors.lineStrong,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: isOnline ? colors.green : colors.muted,
          }}
        />
        <T w="bold" size={15} color={isOnline ? colors.greenText : colors.ink}>
          {isOnline ? 'ONLINE · READY FOR CALLS' : 'OFFLINE · TAP TO GO ONLINE'}
        </T>
      </View>
      <Power size={20} color={isOnline ? colors.green : colors.muted} />
    </Pressable>
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

