import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
import { useTheme } from "@/contexts/ThemeContext";

type HistorialIconProps = SvgProps & {
  size?: number;
  color?: string;
};

/**
 * Icono de Historial (reloj con flecha de retroceso).
 * Se adapta automáticamente al modo oscuro y claro si no se especifica `color`.
 */
export function HistorialIcon(props: HistorialIconProps) {
  const { t } = useTheme();
  const { width, height, size = 24, color = t.title, ...rest } = props ?? {};

  const w = width ?? size;
  const h = height ?? size;

  return (
    <Svg width={w} height={h} viewBox="0 0 24 24" fill="none" {...rest}>
      {/* Flecha de retroceso circular */}
      <Path
        d="M3 3v5h5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arco del reloj / historia */}
      <Path
        d="M3.05 13A9 9 0 1 0 6 5.3L3 8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Manecillas del reloj */}
      <Path
        d="M12 7v5l4 2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default HistorialIcon;
