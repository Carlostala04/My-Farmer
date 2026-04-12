import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

type MapIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function MapIcon(props: MapIconProps) {
  const { t } = useTheme();
  const { width, height, size = 24, color = t.title, stroke, ...rest } = props ?? {};

  const w = width ?? size;
  const h = height ?? size;
  const strokeColor = stroke ?? color;

  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" {...rest}>
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default MapIcon;
