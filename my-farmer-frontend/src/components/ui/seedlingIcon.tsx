import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

type SeedlingIconProps = SvgProps & {
  size?: number
  color?: string
}

const SeedlingIcon = ({
  size = 24,
  color = "#22C55E",
  width,
  height,
  ...props
}: SeedlingIconProps) => (
  <Svg
    width={width ?? size}
    height={height ?? size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    {/* Main stem */}
    <Path d="M12 21V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    {/* Left leaf */}
    <Path
      d="M12 11C12 7 9 4 5 4C5 8 8 11 12 11Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.2"
    />
    {/* Right leaf */}
    <Path
      d="M12 14C12 10 15 7 19 7C19 11 16 14 12 14Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill={color}
      fillOpacity="0.2"
    />
  </Svg>
)

export default SeedlingIcon
