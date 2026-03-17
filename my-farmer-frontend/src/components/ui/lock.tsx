import * as React from "react"
import Svg, { Path, Rect, SvgProps } from "react-native-svg"

const LockIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" {...props} width={24} height={24}>
    <Rect
      x={3}
      y={11}
      width={18}
      height={11}
      rx={2}
      ry={2}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    />
    <Path
      d="M7 11V7a5 5 0 0 1 10 0v4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
)
export default LockIcon
