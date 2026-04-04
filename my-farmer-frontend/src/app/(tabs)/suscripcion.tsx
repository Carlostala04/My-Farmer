import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import NavBar from "@/components/navBar";
import CardSuspription from '@/components/card-suspcription';
import { useTheme } from '@/contexts/ThemeContext';

export default function Suscripcion() {
  const { t } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <NavBar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: t.title }]}>Suscripción</Text>
          <Text style={[styles.subtitle, { color: t.subtitle }]}>
            Desbloquea todas las funciones con el plan Premium
          </Text>
        </View>

        <CardSuspription porcentajeDescuento={0} descuento={false} precio={20} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
});
