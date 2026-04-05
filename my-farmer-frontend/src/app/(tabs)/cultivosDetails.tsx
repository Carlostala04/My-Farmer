/**
 * Pantalla de Detalle de Cultivo (cultivosDetails.tsx)
 *
 * Cambios respecto a la versión anterior:
 *  - Se reemplazaron los datos hardcodeados por datos reales del backend.
 *  - Se recibe `cultivo_id` como parámetro de navegación y se carga el cultivo
 *    completo desde el backend usando `getCultivoById`.
 *  - Se cargan los recordatorios del cultivo usando `useRecordatorios`, filtrando
 *    por Entidad_Tipo === 'cultivo' y Entidad_id === cultivo_id.
 *  - El botón de eliminar ahora llama al backend usando `eliminarCultivo` y luego
 *    regresa a la pantalla anterior.
 *  - Las fechas, rendimiento estimado y notas vienen del campo real del backend.
 *  - Se mantiene la barra de progreso (días desde siembra vs estimado de cosecha).
 *  - Se muestra un indicador de carga mientras se obtienen los datos.
 */

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import ScreenHeader from "@/components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import DeleteIcon from "@/components/ui/deleteIcon";
import EditIcon from "@/components/ui/editIcon";
import { useAuth } from "@/supabase/useAuth";
import { getCultivoById, eliminarCultivo } from "@/services/cultivosService";
import { useRecordatorios } from "@/hooks/useRecordatorios";
import { ResponseCultivoDto } from "@/ts/cultivoProps";

const CultivosDetail = () => {
  const router = useRouter();
  const { session } = useAuth();

  // Parámetros que vienen desde la pantalla de lista de cultivos
  const { cultivo_id, imagen: imagenFallback } = useLocalSearchParams<{
    cultivo_id: string;
    imagen: string;
  }>();

  const [cultivo, setCultivo] = useState<ResponseCultivoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  // Hook de recordatorios para filtrar los de este cultivo
  const { recordatorios } = useRecordatorios();

  // Recordatorios que pertenecen a este cultivo específico
  const recordatoriosDelCultivo = recordatorios.filter(
    (r) =>
      r.Entidad_Tipo === "cultivo" &&
      r.Entidad_id === Number(cultivo_id) &&
      !r.Cancelado,
  );

  // Cargar datos completos del cultivo desde el backend
  useEffect(() => {
    if (!session?.access_token || !cultivo_id) return;

    setLoading(true);
    getCultivoById(Number(cultivo_id), session.access_token)
      .then(setCultivo)
      .catch(() => {
        Alert.alert("Error", "No se pudo cargar el cultivo.");
      })
      .finally(() => setLoading(false));
  }, [cultivo_id, session?.access_token]);

  /** Confirma y elimina el cultivo del backend, luego regresa a la lista. */
  const handleEliminar = () => {
    if (!session?.access_token || !cultivo_id) return;
    Alert.alert(
      "Eliminar Cultivo",
      `¿Estás seguro de que deseas eliminar "${cultivo?.Nombre ?? "este cultivo"}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setEliminando(true);
            try {
              await eliminarCultivo(Number(cultivo_id), session.access_token!);
              router.back();
            } catch (e: any) {
              Alert.alert(
                "Error",
                e.message ?? "No se pudo eliminar el cultivo.",
              );
            } finally {
              setEliminando(false);
            }
          },
        },
      ],
    );
  };

  /**
   * Calcula el progreso entre la fecha de siembra y la fecha estimada de cosecha.
   * Retorna un valor entre 0 y 1.
   */
  const calcularProgreso = (): number => {
    if (!cultivo?.Fecha_Siembra || !cultivo?.Fecha_Cosecha_Estimada) return 0;
    const inicio = new Date(cultivo.Fecha_Siembra).getTime();
    const fin = new Date(cultivo.Fecha_Cosecha_Estimada).getTime();
    const ahora = Date.now();
    if (fin <= inicio) return 0;
    return Math.min(Math.max((ahora - inicio) / (fin - inicio), 0), 1);
  };

  const calcularDias = (): { transcurridos: number; total: number } => {
    if (!cultivo?.Fecha_Siembra || !cultivo?.Fecha_Cosecha_Estimada)
      return { transcurridos: 0, total: 0 };
    const inicio = new Date(cultivo.Fecha_Siembra).getTime();
    const fin = new Date(cultivo.Fecha_Cosecha_Estimada).getTime();
    const ahora = Date.now();
    const MS_DIA = 1000 * 60 * 60 * 24;
    return {
      transcurridos: Math.max(Math.floor((ahora - inicio) / MS_DIA), 0),
      total: Math.max(Math.floor((fin - inicio) / MS_DIA), 1),
    };
  };

  if (loading) {
    return (
      <>
        <ScreenHeader title="Detalle de Cultivo" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  if (!cultivo) {
    return (
      <>
        <ScreenHeader title="Detalle de Cultivo" />
        <View style={styles.centered}>
          <Text style={{ color: Colors.SUBTITLE }}>Cultivo no encontrado.</Text>
        </View>
      </>
    );
  }

  const isActivo = cultivo.Activo;
  const progreso = calcularProgreso();
  const { transcurridos, total } = calcularDias();

  return (
    <>
      <ScreenHeader
        title="Detalle de Cultivo"
        actions={[
          {
            icon: <EditIcon width={22} height={22} />,
            onPress: () =>
              router.push({
                pathname: "/(tabs)/registerCultivos",
                params: { cultivo_id: String(cultivo.Cultivo_id) },
              }),
          },
          {
            icon: eliminando ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <DeleteIcon width={22} height={22} />
            ),
            onPress: handleEliminar,
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
          <Image
            source={{ uri: cultivo.Foto ?? imagenFallback ?? undefined }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroNombre}>{cultivo.Nombre}</Text>
            <Text style={styles.heroSubtitle}>
              {cultivo.Parcela ?? "Sin parcela"} ·{" "}
              {isActivo ? "Activo" : "Histórico"}
            </Text>
          </View>
        </View>

        {/* Seguimiento de Crecimiento */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionTitle}>
              🌱 Seguimiento de Crecimiento
            </Text>
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
            Tipo de cultivo:{" "}
            <Text style={styles.value}>{cultivo.Tipo_Cultivo ?? "—"}</Text>
          </Text>

          {total > 0 && (
            <>
              <View style={styles.daysRow}>
                <Text style={styles.daysIcon}>📅</Text>
                <Text style={styles.label}>
                  Días desde siembra:{" "}
                  <Text style={styles.value}>
                    {transcurridos} de {total}
                  </Text>
                </Text>
              </View>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(progreso * 100)}%` as any },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Siembra</Text>
                <Text style={styles.progressLabel}>
                  {`${Math.round(progreso * 100)}% completado`}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Cosecha y Fechas */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🌾 Cosecha y Fechas</Text>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.label}>Siembra:</Text>
            <Text style={styles.value}>{cultivo.Fecha_Siembra ?? "—"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.label}>Cosecha estimada:</Text>
            <Text style={styles.value}>
              {cultivo.Fecha_Cosecha_Estimada ?? "—"}
            </Text>
          </View>
          {/* <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>✅</Text>
            <Text style={styles.label}>Fecha de cosecha:</Text>
            <Text style={styles.value}>
              {cultivo.Fecha_Cosecha ?? "Sin registrar"}
            </Text>
          </View> */}
          {cultivo.Rendimiento_Estimado != null && (
            <View style={styles.detailRow}>
              <Text style={styles.detailIcon}>⚖️</Text>
              <Text style={styles.label}>Rendimiento estimado:</Text>
              <Text style={styles.value}>
                {cultivo.Rendimiento_Estimado}{" "}
                {cultivo.Rendimiento_Unidad ?? ""}
              </Text>
            </View>
          )}
        </View>

        {/* Notas y Recordatorios */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🔔 Notas y Recordatorios</Text>
          <View style={styles.divider} />

          {cultivo.Notas ? (
            <Text style={styles.notasText}>{cultivo.Notas}</Text>
          ) : (
            <Text style={styles.emptyText}>Sin notas registradas.</Text>
          )}

          <Text style={styles.subSectionTitle}>Recordatorios Próximos</Text>
          {recordatoriosDelCultivo.length === 0 ? (
            <Text style={styles.emptyText}>Sin recordatorios próximos.</Text>
          ) : (
            recordatoriosDelCultivo.map((rec) => (
              <View key={rec.Recordatorio_id} style={styles.reminderRow}>
                <View style={styles.checkbox}>
                  {rec.Cancelado && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.detailIcon}>📅</Text>
                <Text style={styles.reminderText}>
                  {rec.Titulo}{" "}
                  <Text style={styles.reminderDate}>— {rec.Recordar}</Text>
                </Text>
              </View>
            ))
          )}
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
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  contentContainer: { padding: 16, paddingBottom: 40, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  heroCard: {
    ...cardStyle,
    padding: 0,
    height: 180,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.40)",
  },
  heroContent: { padding: 16, gap: 4 },
  heroNombre: { fontSize: 24, fontWeight: "700", color: "#fff" },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.85)" },

  card: { ...cardStyle, gap: 8 },
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
  divider: { height: 1, backgroundColor: Colors.DIVIDER, marginVertical: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "600" },

  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailIcon: { fontSize: 15 },
  daysRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  daysIcon: { fontSize: 15 },
  label: { fontSize: 14, color: Colors.LABEL, flex: 1 },
  value: { fontSize: 14, fontWeight: "600", color: Colors.VALUE },

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
  progressLabels: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 11, color: Colors.SUBTITLE },

  notasText: { fontSize: 13, color: Colors.SUBTITLE, lineHeight: 19 },
  emptyText: { fontSize: 13, color: Colors.SUBTITLE, fontStyle: "italic" },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.TITLE,
    marginTop: 4,
  },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.LABEL,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#fff", fontSize: 11, fontWeight: "700" },
  reminderText: { fontSize: 13, color: Colors.VALUE, flex: 1 },
  reminderDate: { fontSize: 12, color: Colors.SUBTITLE },
});

export default CultivosDetail;
