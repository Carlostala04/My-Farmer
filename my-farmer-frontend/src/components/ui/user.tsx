import * as React from "react"
import Svg, { Path, Circle, SvgProps } from "react-native-svg"

const UserIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props} width={24} height={24}>
    <Circle
      cx={12}
      cy={8}
      r={4}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    />
    <Path
      d="M4 20c0-4 4-6 8-6s8 2 8 6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
)
export default UserIcon
