import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type EmailIconProps = SvgProps & {
  color?: string
}

const SvgComponent = ({ color, ...props }: EmailIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.subtitle;

  return (
    <Svg
      viewBox="0 0 24 24"
      width={24}
      height={24}
      {...props}
    >
      <Path
        fill={iconColor}
        d="m16.484 11.976 6.151-5.344v10.627zm-7.926.905 2.16 1.875c.339.288.781.462 1.264.462h.017-.001.014c.484 0 .926-.175 1.269-.465l-.003.002 2.16-1.875 6.566 5.639H1.995zM1.986 5.365h20.03l-9.621 8.356a.6.6 0 0 1-.38.132h-.014.001-.014a.6.6 0 0 1-.381-.133l.001.001zm-.621 1.266 6.15 5.344-6.15 5.28zm21.6-2.441c-.24-.12-.522-.19-.821-.19H1.859a1.9 1.9 0 0 0-.835.197l.011-.005A1.86 1.86 0 0 0 0 5.855v12.172a1.86 1.86 0 0 0 1.858 1.858h20.283a1.86 1.86 0 0 0 1.858-1.858V5.855c0-.727-.419-1.357-1.029-1.66l-.011-.005z"
      />
    </Svg>
  );
}

export default SvgComponent
