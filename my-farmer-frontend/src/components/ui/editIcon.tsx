import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
import { useTheme } from "@/contexts/ThemeContext"

type EditIconProps = SvgProps & {
  color?: string
}

const EditIcon = ({ color, ...props }: EditIconProps) => {
  const { t } = useTheme();
  const iconColor = color ?? t.title;

  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        fill={iconColor}
        d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
      />
    </Svg>
  );
}

export default EditIcon
