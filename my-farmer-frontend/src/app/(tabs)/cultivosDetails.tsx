import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import ScreenHeader from "@/components/header";
import { useLocalSearchParams } from "expo-router";
import DeleteIcon from "@/components/ui/deleteIcon";

const CultivosDetail = () => {
  const { nombre, fechaSiembra, ubicacion, estado, imagen } =
    useLocalSearchParams<{
      nombre: string;
      fechaSiembra: string;
      ubicacion: string;
      estado: string;
      imagen: string;
    }>();

  const isActivo = estado === "true";

  const diasEnEtapa = 25;
  const totalDiasEtapa = 40;
  const etapaActual = "Desarrollo de Hojas";
  const proximaEtapa = "Floración";
  const cosechaEstimada = "20 Jun 2024";
  const rendimientoEstimado = "500 kg/hectárea";
  const progreso = diasEnEtapa / totalDiasEtapa;

  const notas =
    "Observaciones sobre el riego y fertilización durante la etapa de crecimiento vegetativo. Mantener monitoreo constante de plagas en la semana 10.";

  const recordatorios = [
    { titulo: "Aplicar fungicida", fecha: "10 Jun", completado: false },
    { titulo: "Verificar humedad del suelo", fecha: "05 Jun", completado: true },
  ];

  return (
    <>
      <ScreenHeader
        title="Detalle de Cultivo"
        actions={[
          {
            icon: <DeleteIcon width={22} height={22} />,
            onPress: () => console.log("eliminar cultivo"),
          },
        ]}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero con imagen */}
        <View style={styles.heroCard}>
          <Image source={{ uri: imagen }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroNombre}>{nombre}</Text>
            <Text style={styles.heroSubtitle}>
              {ubicacion} · {isActivo ? "Activo" : "Histórico"}
            </Text>
          </View>
        </View>

        {/* Seguimiento de Crecimiento */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionTitle}>🌱 Seguimiento de Crecimiento</Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: isActivo ? "#d1fae5" : "#fee2e2" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: isActivo ? "#065f46" : "#991b1b" },
                ]}
              >
                {isActivo ? "Activo" : "Histórico"}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <Text style={styles.label}>
            Etapa Actual: <Text style={styles.value}>{etapaActual}</Text>
          </Text>

          <View style={styles.daysRow}>
            <Text style={styles.daysIcon}>📅</Text>
            <Text style={styles.label}>
              Días en etapa:{" "}
              <Text style={styles.value}>
                {diasEnEtapa} de {totalDiasEtapa}
              </Text>
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[styles.progressFill, { width: `${progreso * 100}%` }]}
            />
          </View>

          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>Inicio</Text>
            <Text style={styles.progressLabel}>
              Próxima etapa: {proximaEtapa}
            </Text>
          </View>
        </View>

        {/* Cosecha y Fechas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌾 Cosecha y Fechas Importantes</Text>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.label}>Siembra:</Text>
            <Text style={styles.value}>{fechaSiembra}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.label}>Cosecha Estimada:</Text>
            <Text style={styles.value}>{cosechaEstimada}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>⚖️</Text>
            <Text style={styles.label}>Rendimiento Estimado:</Text>
            <Text style={styles.value}>{rendimientoEstimado}</Text>
          </View>
        </View>

        {/* Notas y Recordatorios */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 Notas y Recordatorios</Text>
          <View style={styles.divider} />

          <Text style={styles.notasText}>{notas}</Text>

          <Text style={styles.subSectionTitle}>Recordatorios Próximos</Text>
          {recordatorios.map((rec, index) => (
            <View key={index} style={styles.reminderRow}>
              <View
                style={[
                  styles.checkbox,
                  rec.completado && styles.checkboxDone,
                ]}
              >
                {rec.completado && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.detailIcon}>📅</Text>
              <Text
                style={[
                  styles.reminderText,
                  rec.completado && styles.reminderTextDone,
                ]}
              >
                {rec.titulo}{" "}
                <Text style={styles.reminderDate}>- {rec.fecha}</Text>
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const cardStyle = {
  backgroundColor: Colors.CARD_DETAILS,
  borderRadius: 16,
  padding: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  heroCard: {
    ...cardStyle,
    padding: 0,
    height: 180,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.40)",
  },
  heroContent: {
    padding: 16,
    gap: 4,
  },
  heroNombre: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },
  card: {
    ...cardStyle,
    gap: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.TITLE,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.DIVIDER,
    marginVertical: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailIcon: {
    fontSize: 15,
  },
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  daysIcon: {
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.LABEL,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.VALUE,
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 99,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.SUBTITLE,
  },
  notasText: {
    fontSize: 13,
    color: Colors.SUBTITLE,
    lineHeight: 19,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.TITLE,
    marginTop: 4,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.LABEL,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  checkmark: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  reminderText: {
    fontSize: 13,
    color: Colors.VALUE,
    flex: 1,
  },
  reminderTextDone: {
    textDecorationLine: "line-through",
    color: Colors.SUBTITLE,
  },
  reminderDate: {
    fontSize: 12,
    color: Colors.SUBTITLE,
  },
});

export default CultivosDetail;