import * as React from "react"
import Svg, { Path, Circle, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type UserIconProps = SvgProps & {
  color?: string
}

const UserIcon = ({ color, ...props }: UserIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.title;

  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Circle
        cx={12}
        cy={8}
        r={4}
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
      />
      <Path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default UserIcon
