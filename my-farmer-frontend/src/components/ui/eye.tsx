import * as React from "react"
import Svg, { Path, Circle, SvgProps } from "react-native-svg"

const EyeIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props} width={24} height={24}>
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={12}
      cy={12}
      r={3}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    />
  </Svg>
)
export default EyeIcon
