import * as React from "react"
import Svg, { Path, Rect, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type LockIconProps = SvgProps & {
  color?: string
}

const LockIcon = ({ color, ...props }: LockIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.subtitle;

  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Rect
        x={3}
        y={11}
        width={18}
        height={11}
        rx={2}
        ry={2}
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
      />
      <Path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default LockIcon
