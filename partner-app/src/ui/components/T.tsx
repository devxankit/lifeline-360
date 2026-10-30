import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { colors, font, FontWeight } from '../theme';

export type TProps = TextProps & {
  w?: FontWeight;
  size?: number;
  color?: string;
  center?: boolean;
  lh?: number;
  style?: StyleProp<TextStyle>;
};

/**
 * App typography component.
 * Uses Plus Jakarta Sans with explicit weight keys, ensuring Android selects font files directly.
 * Caps `maxFontSizeMultiplier` at 1.3 to protect scannable partner layouts from accessibility overflow.
 */
export function T({
  w = 'regular',
  size = 14,
  color = colors.ink,
  center,
  lh,
  style,
  ...rest
}: TProps) {
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[
        {
          fontFamily: font[w],
          fontSize: size,
          color,
          includeFontPadding: false,
          textAlign: center ? 'center' : undefined,
          lineHeight: lh,
        },
        style,
      ]}
    />
  );
}

export default T;
