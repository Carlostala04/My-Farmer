import * as React from "react"
import Svg, { Path, Circle, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type EyeIconProps = SvgProps & {
  color?: string
}

const EyeIcon = ({ color, ...props }: EyeIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.subtitle;

  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={12}
        cy={12}
        r={3}
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
      />
    </Svg>
  );
}

export default EyeIcon
