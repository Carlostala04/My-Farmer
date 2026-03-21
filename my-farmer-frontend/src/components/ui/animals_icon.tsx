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
        strokeWidth={1.5}
      >
        {/* Left ear (rounded triangular shape typical of cows) */}
        <Path d="M7 9 c-2-1-3.5-1.5-3-4 c0.5-2 2-1.5 2.5 0 L8 9" fill={strokeColor} fillOpacity={0.15} />

        {/* Right ear */}
        <Path d="M17 9 c2-1 3.5-1.5 3-4 c-0.5-2-2-1.5-2.5 0 L16 9" fill={strokeColor} fillOpacity={0.15} />

        {/* Inner ear left */}
        <Path d="M7.2 8.5 c-1-0.5-1.8-1-1.5-2.5" strokeWidth={1} />

        {/* Inner ear right */}
        <Path d="M16.8 8.5 c1-0.5 1.8-1 1.5-2.5" strokeWidth={1} />

        {/* Head — rounded top, wider in the middle, narrowing at snout */}
        <Path d="M7 9 c-1 0-2 1-2 2.5 c0 2 0.5 4 1.5 5.5 c1 1.5 2.5 3.5 5.5 3.5 s4.5-2 5.5-3.5 c1-1.5 1.5-3.5 1.5-5.5 c0-1.5-1-2.5-2-2.5 C16 7 14 6 12 6 S8 7 7 9 Z" fill={strokeColor} fillOpacity={0.08} />

        {/* Eyes */}
        <Circle cx={9.8} cy={11.5} r={1.1} fill={strokeColor} stroke="none" />
        <Circle cx={14.2} cy={11.5} r={1.1} fill={strokeColor} stroke="none" />

        {/* Eye shine */}
        <Circle cx={10.2} cy={11.1} r={0.3} fill="white" stroke="none" />
        <Circle cx={14.6} cy={11.1} r={0.3} fill="white" stroke="none" />

        {/* Snout (oval muzzle) */}
        <Path d="M9.5 16 c0-1.5 1-2.5 2.5-2.5 s2.5 1 2.5 2.5 v1.5 c0 1.5-1 2.5-2.5 2.5 s-2.5-1-2.5-2.5 Z" fill={strokeColor} fillOpacity={0.12} />

        {/* Nostrils */}
        <Circle cx={11} cy={17} r={0.5} fill={strokeColor} stroke="none" />
        <Circle cx={13} cy={17} r={0.5} fill={strokeColor} stroke="none" />
      </G>
    </Svg>
  );
}

export default AnimalsIcon;

