import React from 'react';
import Svg, { G, Path, SvgProps } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

type RecordatoriosIconProps = SvgProps & {
  size?: number;
  color?: string;
};

export function RecordatoriosIcon(props: RecordatoriosIconProps) {
  const { t } = useTheme();
  const { width, height, size = 24, color = t.title, stroke, ...rest } = props ?? {};

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
        {/* Bell body */}
        <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />

        {/* Clapper / bottom */}
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" />

        {/* Handle */}
        <Path d="M12 2a1 1 0 0 0-1 1" />
      </G>
    </Svg>
  );
}

export default RecordatoriosIcon;

