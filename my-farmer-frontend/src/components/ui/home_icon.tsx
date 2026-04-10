import React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

type HouseProps = SvgProps & {
  size?: number;
  color?: string;
};

export function House(props: HouseProps) {
  const { t } = useTheme();
  const {
    width,
    height,
    size = 24,
    color = t.title,
    stroke,
    ...rest
  } = props ?? {};

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
        <Path d="m3 9l9-7l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <Path d="M9 22V12h6v10" />
      </G>
    </Svg>
  );
}

export default House;

