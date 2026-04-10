import * as React from "react"
import Svg, { Path, Rect, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type CalendarIconProps = SvgProps & {
  size?: number
  color?: string
}

const CalendarIcon = ({
  size = 24,
  color,
  width,
  height,
  ...props
}: CalendarIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.subtitle;

  return (
    <Svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={iconColor} strokeWidth="1.5" />
      <Path d="M3 9h18" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M8 2v4M16 2v4" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" />
      <Path
        d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default CalendarIcon
