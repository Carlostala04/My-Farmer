import React from 'react';
import Svg, { G, Path, Circle, SvgProps } from 'react-native-svg';

type AnimalsIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function AnimalsIcon(props: AnimalsIconProps) {
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
        {/* Ears */}
        <Path d="M9 10 6.5 8.5 7.5 12" />
        <Path d="M15 10 17.5 8.5 16.5 12" />

        {/* Head */}
        <Path d="M7.5 12c0-4 2.5-7 4.5-7s4.5 3 4.5 7v8h-9v-8Z" />

        {/* Eyes */}
        <Circle cx={10.2} cy={13.2} r={1} fill={strokeColor} stroke="none" />
        <Circle cx={13.8} cy={13.2} r={1} fill={strokeColor} stroke="none" />

        {/* Snout */}
        <Path d="M10 16c0-1 1-2 2-2s2 1 2 2v2c0 1-1 2-2 2s-2-1-2-2v-2Z" />
        <Path d="M12 14.5v1.8" />
      </G>
    </Svg>
  );
}

export default AnimalsIcon;

