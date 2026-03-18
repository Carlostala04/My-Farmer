import React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

type CultivosIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function CultivosIcon(props: CultivosIconProps) {
  const { width, height, size = 24, color = 'black', stroke, ...rest } = props ?? {};

  const w = width ?? size;
  const h = height ?? size;
  const strokeColor = stroke ?? color;

  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" {...rest}>
      <G
        fill="none"
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      >
        {/* Stem */}
        <Path d="M12 21V10" />

        {/* Leaves */}
        <Path d="M12 10c-4 0-7-2-7-6 4 0 7 2 7 6Z" />
        <Path d="M12 10c4 0 7-2 7-6-4 0-7 2-7 6Z" />

        {/* Ground */}
        <Path d="M8 21h8" />
      </G>
    </Svg>
  );
}

export default CultivosIcon;

