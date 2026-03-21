import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const DeleteIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
      fill="currentColor"
      d="M7 3h2a1 1 0 00-2 0M6 3a2 2 0 114 0h4a.5.5 0 010 1h-.564l-1.205 8.838A2.5 2.5 0 019.754 15H6.246a2.5 2.5 0 01-2.477-2.162L2.564 4H2a.5.5 0 010-1zm1 3.5a.5.5 0 00-1 0v5a.5.5 0 001 0zM9.5 6a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5a.5.5 0 01.5-.5m-4.74 6.703A1.5 1.5 0 006.246 14h3.508a1.5 1.5 0 001.487-1.297L12.427 4H3.573z"
    />
  </Svg>
)

export default DeleteIcon
