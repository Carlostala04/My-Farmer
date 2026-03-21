import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import NavBar from "@/components/navBar";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";

export default function RecordatoriosScreen() {
  return (
    <>
      <NavBar />
      <ScreenHeader
        title="Recordatorios"
        actions={[
          {
            icon: <FilterIcon width={22} height={22} />,
            onPress: () => console.log("Recordatorios"),
          },
        ]}
      />
      <View style={styles.content}>
        <ThemedText type="subtitle">Recordatorios</ThemedText>
        <ThemedText style={styles.hint} type="small">
          Aquí irán tus recordatorios.
        </ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 8,
  },
  hint: { opacity: 0.8 },
});
