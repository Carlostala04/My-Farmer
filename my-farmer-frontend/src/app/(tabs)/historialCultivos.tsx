/**
 * Pantalla de Historial de Cultivo (historialCultivos.tsx)
 *
 * Muestra el historial de cambios de un cultivo específico.
 * Cada registro indica qué campo fue modificado, el valor anterior
 * y el valor nuevo, junto con la fecha del cambio.
 *
 * Recibe `cultivo_id` y `cultivo_nombre` como parámetros de navegación.
 * Se adapta al modo oscuro y claro usando useTheme.
 */

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import ScreenHeader from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import { useHistorialCultivo } from "@/hooks/useHistorialCultivo";
import { useTheme } from "@/contexts/ThemeContext";
import Colors from "@/constants/colors";
import { HistorialIcon } from "@/components/ui/historialIcon";

export default function HistorialCultivos() {
  const { t, darkMode } = useTheme();
  const { cultivo_id, cultivo_nombre } = useLocalSearchParams<{
    cultivo_id: string;
    cultivo_nombre: string;
  }>();

  const { historial, loading, error } = useHistorialCultivo(
    cultivo_id ? Number(cultivo_id) : null,
  );

  return (
    <>
      <ScreenHeader title={`Historial: ${cultivo_nombre ?? "Cultivo"}`} />
      <ScrollView
        style={[styles.container, { backgroundColor: t.bg }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <Text style={[styles.errorText, { color: "#EF4444" }]}>{error}</Text>
          </View>
        )}

        {!loading && !error && historial.length === 0 && (
          <View style={styles.centered}>
            <HistorialIcon size={48} color={t.subtitle} />
            <Text style={[styles.emptyText, { color: t.subtitle }]}>
              Sin cambios registrados.
            </Text>
          </View>
        )}

        {!loading && historial.map((item) => (
          <View
            key={item.Historial_Cultivo_id}
            style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}
          >
            {/* Cabecera: campo modificado + fecha */}
            <View style={styles.cardHeader}>
              <View style={[
                styles.campoBadge,
                {
                  backgroundColor: darkMode ? "#166534" : "#DCFCE7",
                  borderColor: darkMode ? "#22C55E55" : "#86EFAC",
                },
              ]}>
                <View style={[styles.campoDot, { backgroundColor: darkMode ? "#4ADE80" : "#16A34A" }]} />
                <Text style={[styles.campoText, { color: darkMode ? "#4ADE80" : "#15803D" }]}>
                  {item.Campo_Mod.replace(/_/g, " ")}
                </Text>
              </View>
              <Text style={[styles.fechaText, { color: t.subtitle }]}>
                {formatDate(item.Fecha)}
              </Text>
            </View>

            {/* Valores: anterior → nuevo */}
            <View style={[styles.divider, { backgroundColor: t.border }]} />
            <View style={styles.valoresRow}>
              <View style={styles.valorBox}>
                <Text style={[styles.valorLabel, { color: t.subtitle }]}>Anterior</Text>
                <Text
                  style={[styles.valorText, { color: t.title, backgroundColor: darkMode ? "#7F1D1D" : "#FEE2E2" }]}
                  numberOfLines={3}
                >
                  {item.Valor_Ant || "—"}
                </Text>
              </View>
              <Text style={[styles.arrow, { color: t.subtitle }]}>→</Text>
              <View style={styles.valorBox}>
                <Text style={[styles.valorLabel, { color: t.subtitle }]}>Nuevo</Text>
                <Text
                  style={[styles.valorText, { color: t.title, backgroundColor: darkMode ? "#14532D" : "#D1FAE5" }]}
                  numberOfLines={3}
                >
                  {item.Valor_Nue || "—"}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 10 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: { fontSize: 15, fontStyle: "italic" },
  errorText: { fontSize: 14 },

  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  campoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  campoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  campoText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  fechaText: {
    fontSize: 12,
  },
  divider: { height: 1 },
  valoresRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  valorBox: { flex: 1, gap: 4 },
  valorLabel: { fontSize: 11, fontWeight: "600" },
  valorText: {
    fontSize: 13,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    overflow: "hidden",
  },
  arrow: { fontSize: 18, fontWeight: "700" },
});
