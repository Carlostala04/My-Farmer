import * as React from "react"
import Svg, { Path, Line, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type EyeOffIconProps = SvgProps & {
  color?: string
}

const EyeOffIcon = ({ color, ...props }: EyeOffIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.subtitle;

  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        fill="none"
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1={1}
        y1={1}
        x2={23}
        y2={23}
        stroke={iconColor}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default EyeOffIcon
