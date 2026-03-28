import React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';

type WheatIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function WheatIcon(props: WheatIconProps) {
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
        {/* Main stem */}
        <Path d="M12 21 L12 5" />

        {/* Top grain left */}
        <Path d="M12 8 C11 7 9.5 5.5 10 4 C11 4 12.5 5.5 12 8Z" fill={c} fillOpacity={0.18} />
        {/* Top grain right */}
        <Path d="M12 8 C13 7 14.5 5.5 14 4 C13 4 11.5 5.5 12 8Z" fill={c} fillOpacity={0.18} />

        {/* Middle grain left */}
        <Path d="M12 12 C10.5 11 9 9 9.5 7.5 C10.5 7.5 12 9 12 12Z" fill={c} fillOpacity={0.22} />
        {/* Middle grain right */}
        <Path d="M12 12 C13.5 11 15 9 14.5 7.5 C13.5 7.5 12 9 12 12Z" fill={c} fillOpacity={0.22} />

        {/* Lower grain left */}
        <Path d="M12 15.5 C10 14.5 8.5 12 9 10.5 C10.5 10.5 12 12.5 12 15.5Z" fill={c} fillOpacity={0.28} />
        {/* Lower grain right */}
        <Path d="M12 15.5 C14 14.5 15.5 12 15 10.5 C13.5 10.5 12 12.5 12 15.5Z" fill={c} fillOpacity={0.28} />

        {/* Ground line */}
        <Path d="M8 21 L16 21" />
      </G>
    </Svg>
  );
}

export default WheatIcon;
