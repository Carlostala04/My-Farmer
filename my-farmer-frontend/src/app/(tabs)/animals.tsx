import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import NavBar from '@/components/navBar';

export default function AnimalsScreen() {
  return (
    <ThemedView style={styles.screen}>
      <NavBar />
      <View style={styles.content}>
        <ThemedText type="subtitle">Animales</ThemedText>
        <ThemedText style={styles.hint} type="small">
          Aquí irán las opciones de animales.
        </ThemedText>
      </View>
    </ThemedView>
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

