import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import T from './T';
import { colors } from '../theme';

const PETAL = 'M57 55C46 58 22 56 16 40C10 24 24 10 40 13C54 16 60 34 57 55Z';
const CROSS = 'M49 33H71V49H87V71H71V87H49V71H33V49H49Z';

/** Vector redraw of the Lifeline 360 mark: four gradient petals and a cream cross. */
export function LifelineMark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="Lifeline 360">
      <Defs>
        <LinearGradient id="pA" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FF6BF0" />
          <Stop offset="1" stopColor="#E00ED6" />
        </LinearGradient>
        <LinearGradient id="pB" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFB24A" />
          <Stop offset="1" stopColor="#FF2D72" />
        </LinearGradient>
        <LinearGradient id="pC" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#22DCEB" />
          <Stop offset="1" stopColor="#34E38E" />
        </LinearGradient>
        <LinearGradient id="pD" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#2FADFF" />
          <Stop offset="1" stopColor="#C04DFF" />
        </LinearGradient>
        <RadialGradient id="pX" cx="0.5" cy="0.45" r="0.6">
          <Stop offset="0" stopColor="#FFFEFA" />
          <Stop offset="1" stopColor="#FBE3B6" />
        </RadialGradient>
      </Defs>
      <Path d={PETAL} fill="url(#pA)" />
      <Path d={PETAL} fill="url(#pB)" transform="translate(120 0) scale(-1 1)" />
      <Path d={PETAL} fill="url(#pC)" transform="translate(0 120) scale(1 -1)" />
      <Path d={PETAL} fill="url(#pD)" transform="rotate(180 60 60)" />
      <Path d={CROSS} fill="url(#pX)" stroke="#F3D7A2" strokeWidth={2.5} strokeLinejoin="round" />
    </Svg>
  );
}

export function Wordmark({ size = 17, light }: { size?: number; light?: boolean }) {
  return (
    <T w="extrabold" size={size} color={light ? colors.white : colors.ink}>
      Lifeline <T w="extrabold" size={size} color={light ? '#7FD3C7' : colors.teal}>Driver</T>
    </T>
  );
}

/** Horizontal or vertical fade, drawn with SVG so it works on every architecture. */
export function Fade({
  color,
  to,
  fromOpacity = 1,
  toOpacity = 0,
  direction = 'horizontal',
  stops = [0, 1],
  style,
}: {
  color: string;
  to?: string;
  fromOpacity?: number;
  toOpacity?: number;
  direction?: 'horizontal' | 'vertical';
  stops?: [number, number];
  style?: StyleProp<ViewStyle>;
}) {
  const id = 'g' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, style]}>
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2={direction === 'horizontal' ? '1' : '0'} y2={direction === 'horizontal' ? '0' : '1'}>
            <Stop offset={stops[0]} stopColor={color} stopOpacity={fromOpacity} />
            <Stop offset={stops[1]} stopColor={to ?? color} stopOpacity={toOpacity} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

export function DuoIcon({ name, size = 32 }: { name: 'ambulance' | 'navigation' | 'emergency' | 'earnings'; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {name === 'ambulance' ? (
        <G>
          <Rect x="2" y="8" width="18" height="15" rx="3" fill="#D13238" />
          <Path d="M20 12h5.4a2 2 0 0 1 1.7 1l2.4 4.2V23H20Z" fill="#F08A8E" />
          <Path d="M11 12.5v7M7.5 16h7" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
          <Rect x="21.5" y="13.5" width="4.2" height="3.6" rx="1" fill="#FFFFFF" opacity={0.9} />
          <Circle cx="8" cy="24" r="3.2" fill="#1C2340" />
          <Circle cx="23.5" cy="24" r="3.2" fill="#1C2340" />
          <Circle cx="8" cy="24" r="1.2" fill="#FFFFFF" />
          <Circle cx="23.5" cy="24" r="1.2" fill="#FFFFFF" />
        </G>
      ) : null}
      {name === 'navigation' ? (
        <G>
          <Circle cx="16" cy="16" r="14" fill="#0BA5EC" opacity={0.15} />
          <Path d="M16 6L24 24L16 20L8 24Z" fill="#0BA5EC" />
        </G>
      ) : null}
      {name === 'emergency' ? (
        <G>
          <Circle cx="16" cy="16" r="14" fill="#D92D20" opacity={0.15} />
          <Path d="M16 8v10M16 22v2" stroke="#D92D20" strokeWidth={3} strokeLinecap="round" />
        </G>
      ) : null}
      {name === 'earnings' ? (
        <G>
          <Circle cx="16" cy="16" r="14" fill="#12B76A" opacity={0.15} />
          <Path d="M12 10h8M12 14h8M14 10v12M18 10a4 4 0 0 1 0 8H12" stroke="#12B76A" strokeWidth={2} strokeLinecap="round" />
        </G>
      ) : null}
    </Svg>
  );
}

/* --------------------------------------------------- Designed street map */

type Pt = [number, number];
const ROUTE_PICKUP: Pt[] = [
  [80, 480],
  [80, 320],
  [180, 320],
  [180, 200],
  [260, 200],
  [280, 110],
];

const ROUTE_HOSPITAL: Pt[] = [
  [280, 110],
  [280, 200],
  [220, 260],
  [140, 260],
  [140, 400],
  [70, 440],
];

function along(points: Pt[], t: number): { p: Pt; angle: number } {
  const segs = points.slice(1).map((p, i) => {
    const a = points[i];
    return { a, b: p, len: Math.hypot(p[0] - a[0], p[1] - a[1]) };
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  let d = Math.min(Math.max(t, 0), 1) * total;
  for (const s of segs) {
    if (d <= s.len) {
      const k = s.len ? d / s.len : 0;
      return {
        p: [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k],
        angle: (Math.atan2(s.b[1] - s.a[1], s.b[0] - s.a[0]) * 180) / Math.PI,
      };
    }
    d -= s.len;
  }
  const last = segs[segs.length - 1];
  return { p: last.b, angle: (Math.atan2(last.b[1] - last.a[1], last.b[0] - last.a[0]) * 180) / Math.PI };
}

/**
 * Driver map: High contrast street navigation map.
 * Supports daylight and night driving themes with active routing and animated vehicle.
 */
export function DesignedMap({
  progress,
  destinationLabel = 'AIIMS Trauma Centre',
  pickupLabel = 'Pickup: Indiranagar',
  mode = 'idle',
  dark = false,
  height = 420,
}: {
  progress?: number;
  destinationLabel?: string;
  pickupLabel?: string;
  mode?: 'idle' | 'to_pickup' | 'to_hospital';
  dark?: boolean;
  height?: number;
}) {
  const points = mode === 'to_hospital' ? ROUTE_HOSPITAL : ROUTE_PICKUP;
  const routePath = 'M' + points.map((p) => p.join(' ')).join('L');
  const vehicle = progress != null ? along(points, progress) : { p: points[0], angle: -90 };

  const bg = dark ? '#081420' : '#EAF0EE';
  const roadColor = dark ? '#132435' : '#FFFFFF';
  const majorRoadColor = dark ? '#182E44' : '#F9FBFB';
  const arterialColor = dark ? '#284E70' : '#E2E8E6';
  const routeColor = mode === 'to_hospital' ? colors.red : colors.teal;

  return (
    <Svg width="100%" height={height} viewBox="0 0 390 540" preserveAspectRatio="xMidYMid slice">
      <Rect width="390" height="540" fill={bg} />

      {/* Urban green & water accents */}
      <Path d="M260 0C270 50 310 80 390 85V0Z" fill={dark ? '#0A2520' : '#D6EBDD'} />
      <Path d="M0 380C35 375 60 390 80 415C95 435 90 475 50 505L0 520Z" fill={dark ? '#0A2520' : '#D6EBDD'} />
      <Path d="M310 320C340 310 375 320 390 335V420C360 410 330 400 310 385C295 370 295 330 310 320Z" fill={dark ? '#0E293E' : '#CFE3F3'} />

      {/* Road Grid */}
      <G stroke={roadColor} fill="none" strokeLinecap="round">
        <Path d="M-10 150C80 140 160 160 230 150S330 120 400 130" strokeWidth={15} stroke={majorRoadColor} />
        <Path d="M150 -10C160 90 140 200 160 300S150 450 170 560" strokeWidth={13} stroke={majorRoadColor} />
        <Path d="M-10 290H400" strokeWidth={10} />
        <Path d="M60 -10V560M270 -10C276 120 268 220 280 560" strokeWidth={8} />
        <Path d="M-10 70H400M-10 220H400M-10 430H400M-10 500H400" strokeWidth={6} stroke={arterialColor} />
        <Path d="M110 -10V560M210 -10V560M330 -10V560" strokeWidth={5} stroke={arterialColor} />
      </G>

      {/* Highlighted arterial */}
      <Path d="M-10 150C80 140 160 160 230 150S330 120 400 130" stroke={dark ? '#334860' : '#F6DFAB'} strokeWidth={6} fill="none" strokeLinecap="round" />

      {/* Active Navigation Polyline */}
      {mode !== 'idle' ? (
        <G>
          <Path d={routePath} fill="none" stroke={dark ? '#000000' : '#1C2340'} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
          <Path d={routePath} fill="none" stroke={routeColor} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />

          {/* Pickup Pin */}
          <G transform="translate(280 110)">
            <Circle r="18" fill={colors.teal} opacity={0.2} />
            <Circle r="8" fill={colors.teal} stroke="#FFFFFF" strokeWidth={3} />
            <Rect x="-60" y="-34" width="120" height="24" rx="6" fill={dark ? '#13263A' : '#1C2340'} />
            <SvgText x={0} y={-18} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
              {pickupLabel}
            </SvgText>
          </G>

          {/* Hospital Pin */}
          {mode === 'to_hospital' ? (
            <G transform="translate(70 440)">
              <Circle r="20" fill={colors.red} opacity={0.25} />
              <Circle r="10" fill={colors.red} stroke="#FFFFFF" strokeWidth={3} />
              <Path d="M-4 0H4M0 -4V4" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="round" />
              <Rect x="-70" y="16" width="140" height="24" rx="6" fill={dark ? '#13263A' : '#1C2340'} />
              <SvgText x={0} y={32} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
                {destinationLabel}
              </SvgText>
            </G>
          ) : null}
        </G>
      ) : (
        /* Driver Idle GPS Pulse */
        <G transform="translate(195 270)">
          <Circle r="48" fill={colors.teal} opacity={0.12} />
          <Circle r="24" fill={colors.teal} opacity={0.25} />
          <Circle r="10" fill={colors.teal} stroke="#FFFFFF" strokeWidth={3} />
        </G>
      )}

      {/* Vehicle Marker */}
      {mode !== 'idle' ? (
        <G transform={`translate(${vehicle.p[0]} ${vehicle.p[1]}) rotate(${vehicle.angle})`}>
          <Rect x="-18" y="-11" width="36" height="22" rx="6" fill="#FFFFFF" stroke={colors.red} strokeWidth={2.5} />
          <Rect x="8" y="-9" width="8" height="18" rx="2" fill="#75B6F0" />
          <Path d="M-10 0H0M-5 -5V5" stroke={colors.red} strokeWidth={2.6} strokeLinecap="round" />
        </G>
      ) : null}
    </Svg>
  );
}

