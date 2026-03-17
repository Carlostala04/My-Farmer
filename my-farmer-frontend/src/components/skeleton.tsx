import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/colors";

export default function Skeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.card} />
      <View style={styles.textLineLarge} />
      <View style={styles.textLineSmall} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    backgroundColor: Colors.SKELETON_BACKGROUND,
  },
  textLineLarge: {
    width: "70%",
    height: 16,
    borderRadius: 999,
    backgroundColor: Colors.SKELETON_BACKGROUND,
  },
  textLineSmall: {
    width: "40%",
    height: 14,
    borderRadius: 999,
    backgroundColor: Colors.SKELETON_BACKGROUND,
  },
});
