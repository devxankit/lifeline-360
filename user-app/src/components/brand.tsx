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
      Lifeline <T w="extrabold" size={size} color={light ? '#7FD3C7' : colors.teal}>360</T>
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
  /** Second colour; defaults to `color`, so the fade is just an opacity ramp. */
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

/* ---------------------------------------------- Two-tone service icons */

export function DuoIcon({ name, size = 32 }: { name: 'ambulance' | 'blood' | 'report' | 'membership'; size?: number }) {
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
      {name === 'blood' ? (
        <G>
          <Path d="M16 3c4 6 9 10.5 9 16.2A9 9 0 0 1 7 19.2C7 13.5 12 9 16 3Z" fill="#F27BA2" />
          <Path d="M16 3c4 6 9 10.5 9 16.2A9 9 0 0 1 16 28.2Z" fill="#C62E57" />
          <Path d="M11.5 19.5A4.5 4.5 0 0 0 16 24" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" fill="none" />
        </G>
      ) : null}
      {name === 'report' ? (
        <G>
          <Rect x="6" y="3" width="20" height="26" rx="3.5" fill="#BFDDF6" />
          <Path d="M19 3h3.5A3.5 3.5 0 0 1 26 6.5V10h-4a3 3 0 0 1-3-3Z" fill="#7DB8E8" />
          <Rect x="10" y="11.5" width="11" height="2.2" rx="1.1" fill="#1D6FAE" />
          <Rect x="10" y="16" width="8" height="2.2" rx="1.1" fill="#1D6FAE" />
          <Path d="M10 23.5h2.5l1.6-2.6 2 4 1.6-2.2H22" stroke="#1D6FAE" strokeWidth={1.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      ) : null}
      {name === 'membership' ? (
        <G>
          <Rect x="2" y="7" width="28" height="19" rx="3.5" fill="#F5CB4E" />
          <Rect x="2" y="11" width="28" height="3.6" fill="#C99A12" />
          <Rect x="5.5" y="19" width="9" height="2.3" rx="1.15" fill="#FFFFFF" />
          <Path d="M24 17.3l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3Z" fill="#FFFFFF" />
        </G>
      ) : null}
    </Svg>
  );
}

/** Medicine pack thumbnail: a tinted tile with a blister strip, coloured per category. */
export function ProductThumb({ tint, size = 64 }: { tint: { bg: string; fg: string }; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: 12, backgroundColor: tint.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size * 0.66} height={size * 0.66} viewBox="0 0 40 40">
        <Rect x="5" y="9" width="30" height="22" rx="4" fill="#FFFFFF" />
        <Rect x="5" y="9" width="30" height="22" rx="4" fill={tint.fg} opacity={0.14} />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => <Rect key={`${c}${r}`} x={9 + c * 8.5} y={13 + r * 8} width="6" height="5" rx="2.5" fill={tint.fg} opacity={0.85} />),
        )}
      </Svg>
    </View>
  );
}

/* --------------------------------------------------- Designed street map */

type Pt = [number, number];
const ROUTE: Pt[] = [
  [60, 430],
  [60, 290],
  [160, 290],
  [156, 152],
  [232, 150],
  [268, 70],
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
 * Stylised map used until a Google Maps key is configured. Draws streets,
 * the pickup → hospital route and, when `progress` is given, the vehicle at
 * that point along the route.
 */
export function DesignedMap({
  progress,
  destinationLabel = 'Manipal Hospital',
  showRoute = true,
  height = 540,
}: {
  progress?: number;
  destinationLabel?: string;
  showRoute?: boolean;
  height?: number;
}) {
  const routePath = 'M' + ROUTE.map((p) => p.join(' ')).join('L');
  const vehicle = progress != null ? along(ROUTE, progress) : null;
  return (
    <Svg width="100%" height={height} viewBox="0 0 390 540" preserveAspectRatio="xMidYMid slice">
      <Rect width="390" height="540" fill="#EEF0EE" />
      <Path d="M250 0C262 60 300 90 390 96V0Z" fill="#D7EBDD" />
      <Path d="M0 360C40 352 70 372 92 400C108 420 100 470 60 500L0 520Z" fill="#D7EBDD" />
      <Path d="M300 300C330 290 370 300 390 320V420C360 410 320 400 300 380C285 365 285 310 300 300Z" fill="#CFE3F3" />
      <G stroke="#FFFFFF" fill="none" strokeLinecap="round">
        <Path d="M-10 150C80 140 160 160 230 150S330 120 400 130" strokeWidth={14} />
        <Path d="M150 -10C160 90 140 200 160 300S150 450 170 560" strokeWidth={12} />
        <Path d="M-10 290H400" strokeWidth={9} />
        <Path d="M60 -10V560M270 -10C276 120 268 220 280 560" strokeWidth={7} />
        <Path d="M-10 70H400M-10 220H400M-10 430H400M-10 500H400" strokeWidth={5} />
        <Path d="M110 -10V560M210 -10V560M330 -10V560" strokeWidth={4} />
      </G>
      <Path d="M-10 150C80 140 160 160 230 150S330 120 400 130" stroke="#F3D79B" strokeWidth={6} fill="none" strokeLinecap="round" />
      {showRoute ? (
        <G>
          <Path d={routePath} fill="none" stroke="#1C2340" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={0.2} />
          <Path d={routePath} fill="none" stroke={colors.teal} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          <G transform="translate(268 66)">
            <Rect x="-56" y="-36" width="112" height="24" rx="6" fill="#1C2340" />
            <Circle r="9" fill="#FFFFFF" stroke="#1C2340" strokeWidth={3} />
            <Path d="M-3.5 0H3.5M0 -3.5V3.5" stroke="#D13238" strokeWidth={2.4} strokeLinecap="round" />
          </G>
          <G transform="translate(60 430)">
            <Circle r="16" fill={colors.teal} opacity={0.18} />
            <Circle r="7" fill={colors.teal} stroke="#FFFFFF" strokeWidth={3} />
          </G>
        </G>
      ) : (
        <G transform="translate(195 270)">
          <Circle r="40" fill={colors.teal} opacity={0.12} />
          <Circle r="9" fill={colors.teal} stroke="#FFFFFF" strokeWidth={3} />
        </G>
      )}
      {vehicle ? (
        <G transform={`translate(${vehicle.p[0]} ${vehicle.p[1]}) rotate(${vehicle.angle})`}>
          <Rect x="-15" y="-9" width="30" height="18" rx="5" fill="#FFFFFF" stroke="#D13238" strokeWidth={2} />
          <Rect x="6" y="-7" width="7" height="14" rx="2" fill="#9CC9F0" />
          <Path d="M-8 0H0M-4 -4V4" stroke="#D13238" strokeWidth={2.2} strokeLinecap="round" />
        </G>
      ) : null}
      {showRoute ? <MapLabel x={268} y={48} text={destinationLabel} /> : null}
    </Svg>
  );
}

function MapLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <SvgText x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF" fontFamily="PlusJakartaSans-Bold">
      {text}
    </SvgText>
  );
}
