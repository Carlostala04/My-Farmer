import React from 'react';
import Svg, { G, Path, Circle, Ellipse, SvgProps } from 'react-native-svg';

type LivestockIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function LivestockIcon(props: LivestockIconProps) {
  const { width, height, size = 24, color = 'black', stroke, ...rest } = props ?? {};

  const w = width ?? size;
  const h = height ?? size;
  const c = stroke ?? color;

  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" {...rest}>
      <G
        fill="none"
        stroke={c}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        {/* Body */}
        <Ellipse cx={9} cy={13} rx={6} ry={3.5} fill={c} fillOpacity={0.12} />

        {/* Head */}
        <Circle cx={17.5} cy={10} r={2.5} fill={c} fillOpacity={0.1} />

        {/* Horn */}
        <Path d="M17.5 7.5 L18.5 5.5" />

        {/* Ear */}
        <Path d="M15.2 8.5 L14 7.5" />

        {/* Eye */}
        <Circle cx={18.2} cy={10} r={0.5} fill={c} stroke="none" />

        {/* Nostril */}
        <Circle cx={19.5} cy={11.5} r={0.35} fill={c} stroke="none" />

        {/* Tail */}
        <Path d="M3 12.5 Q1.5 10.5 2 8" />

        {/* Front legs */}
        <Path d="M11 16.5 L11 21" />
        <Path d="M13 16.5 L13 20.5" />

        {/* Back legs */}
        <Path d="M6 16.5 L6 21" />
        <Path d="M8 16.5 L8 20.5" />

        {/* Spot on body */}
        <Ellipse cx={9.5} cy={12.5} rx={1.8} ry={1.1} fill={c} fillOpacity={0.22} stroke="none" />
      </G>
    </Svg>
  );
}

export default LivestockIcon;
