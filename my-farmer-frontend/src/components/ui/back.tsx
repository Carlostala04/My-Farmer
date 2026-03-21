import * as React from "react";
import { Pressable } from "react-native";
import Svg, { Polyline, SvgProps } from "react-native-svg";
import { useRouter } from "expo-router";

const BackIcon = (props: SvgProps) => {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()}>
      <Svg
        viewBox="0 0 24 24"
        width={24}
        height={24}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <Polyline points="15 18 9 12 15 6" />
      </Svg>
    </Pressable>
  );
};

export default BackIcon;
