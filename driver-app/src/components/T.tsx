import React from 'react';
import { Text, TextProps } from 'react-native';
import { colors, font, FontWeight } from '../theme';

type Props = TextProps & {
  w?: FontWeight;
  size?: number;
  color?: string;
  center?: boolean;
  lh?: number;
};

/** App text: Plus Jakarta Sans with explicit weight for reliable Android rendering. */
export default function T({ w = 'regular', size = 14, color = colors.ink, center, lh, style, ...rest }: Props) {
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

