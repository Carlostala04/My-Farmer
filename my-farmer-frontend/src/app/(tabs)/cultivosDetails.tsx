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
 *  - Se adapta al modo oscuro y claro usando useTheme.
 *  - Los emojis 🌱, 📅, 🌾, 🔔 fueron reemplazados por iconos SVG.
 */

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
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
import { useCosechas } from "@/hooks/useCosechas";
import { useCrecimientos } from "@/hooks/useCrecimientos";
import { ResponseCultivoDto } from "@/ts/cultivoProps";
import { useTheme } from "@/contexts/ThemeContext";
import CalendarIcon from "@/components/ui/calendarIcon";
import SeedlingIcon from "@/components/ui/seedlingIcon";
import { WheatIcon } from "@/components/ui/wheat_icon";
import { RecordatoriosIcon } from "@/components/ui/recordatorios_icon";

const CultivosDetail = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { t } = useTheme();

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

  // Hook de cosechas para este cultivo
  const { cosechas } = useCosechas(cultivo_id ? Number(cultivo_id) : null);

  // Hook de crecimiento para este cultivo
  const { crecimientos } = useCrecimientos(
    cultivo_id ? Number(cultivo_id) : null,
  );

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
        <View style={[styles.centered, { backgroundColor: t.bg }]}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  if (!cultivo) {
    return (
      <>
        <ScreenHeader title="Detalle de Cultivo" />
        <View style={[styles.centered, { backgroundColor: t.bg }]}>
          <Text style={{ color: t.subtitle }}>Cultivo no encontrado.</Text>
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
        style={[styles.container, { backgroundColor: t.bg }]}
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
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.cardTitleRow}>
            <SeedlingIcon size={18} color={Colors.PRIMARY_GREEN} />
            <Text style={[styles.sectionTitle, { color: t.title }]}>
              Seguimiento de Crecimiento
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
          <View style={[styles.divider, { backgroundColor: t.border }]} />

          <Text style={[styles.label, { color: t.subtitle }]}>
            Tipo de cultivo:{" "}
            <Text style={[styles.value, { color: t.title }]}>{cultivo.Tipo_Cultivo ?? "—"}</Text>
          </Text>

          {total > 0 && (
            <>
              <View style={styles.daysRow}>
                <CalendarIcon size={15} color={t.subtitle} />
                <Text style={[styles.label, { color: t.subtitle }]}>
                  Días desde siembra:{" "}
                  <Text style={[styles.value, { color: t.title }]}>
                    {transcurridos} de {total}
                  </Text>
                </Text>
              </View>
              <View style={[styles.progressBackground, { backgroundColor: t.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round(progreso * 100)}%` as any },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={[styles.progressLabel, { color: t.subtitle }]}>Siembra</Text>
                <Text style={[styles.progressLabel, { color: t.subtitle }]}>
                  {`${Math.round(progreso * 100)}% completado`}
                </Text>
              </View>
            </>
          )}

          {crecimientos.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: t.border }]} />
              <Text style={[styles.subSectionTitle, { color: t.title }]}>
                Registros de Crecimiento
              </Text>
              {crecimientos.map((reg) => (
                <View key={reg.Crecimiento_id} style={[styles.cosechaRow, { borderLeftColor: Colors.PRIMARY_GREEN }]}>
                  <View style={styles.cosechaInfo}>
                    <Text style={[styles.cosechaFecha, { color: t.subtitle }]}>
                      {reg.Registro.slice(0, 10)}
                    </Text>
                    {reg.Altura != null && (
                      <Text style={[styles.cosechaCantidad, { color: t.title }]}>
                        {reg.Altura} cm
                      </Text>
                    )}
                  </View>
                  {reg.Observaciones ? (
                    <Text style={[styles.cosechaObs, { color: t.subtitle }]}>{reg.Observaciones}</Text>
                  ) : null}
                </View>
              ))}
            </>
          )}
        </View>

        {/* Cosecha y Fechas */}
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.cardTitleRow}>
            <WheatIcon size={18} color={t.title} />
            <Text style={[styles.sectionTitle, { color: t.title }]}>Cosecha y Fechas</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />

          <View style={styles.detailRow}>
            <CalendarIcon size={15} color={t.subtitle} />
            <Text style={[styles.label, { color: t.subtitle }]}>Siembra:</Text>
            <Text style={[styles.value, { color: t.title }]}>{cultivo.Fecha_Siembra ?? "—"}</Text>
          </View>
          <View style={styles.detailRow}>
            <CalendarIcon size={15} color={t.subtitle} />
            <Text style={[styles.label, { color: t.subtitle }]}>Cosecha estimada:</Text>
            <Text style={[styles.value, { color: t.title }]}>
              {cultivo.Fecha_Cosecha_Estimada ?? "—"}
            </Text>
          </View>
          {cultivo.Rendimiento_Estimado != null && (
            <View style={styles.detailRow}>
              <WheatIcon size={15} color={t.subtitle} />
              <Text style={[styles.label, { color: t.subtitle }]}>Rendimiento estimado:</Text>
              <Text style={[styles.value, { color: t.title }]}>
                {cultivo.Rendimiento_Estimado}{" "}
                {cultivo.Rendimiento_Unidad ?? ""}
              </Text>
            </View>
          )}
        </View>

        {/* Cosechas Registradas */}
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.cardTitleRow}>
            <WheatIcon size={18} color={t.title} />
            <Text style={[styles.sectionTitle, { color: t.title }]}>Cosechas Registradas</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          {cosechas.length === 0 ? (
            <Text style={[styles.emptyText, { color: t.subtitle }]}>Sin cosechas registradas.</Text>
          ) : (
            cosechas.map((cosecha) => (
              <View key={cosecha.Cosecha_id} style={[styles.cosechaRow, { borderLeftColor: Colors.PRIMARY_GREEN }]}>
                <View style={styles.cosechaInfo}>
                  <Text style={[styles.cosechaFecha, { color: t.subtitle }]}>{cosecha.Fecha}</Text>
                  <Text style={[styles.cosechaCantidad, { color: t.title }]}>
                    {cosecha.Cantidad} {cosecha.Unidad}
                  </Text>
                </View>
                {cosecha.Observaciones ? (
                  <Text style={[styles.cosechaObs, { color: t.subtitle }]}>{cosecha.Observaciones}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>

        {/* Historial del Cultivo */}
        <TouchableOpacity
          style={styles.historialBtn}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/historialCultivos",
              params: { cultivoId: String(cultivo_id) },
            })
          }
        >
          <Text style={styles.historialBtnText}>Ver Historial del Cultivo</Text>
        </TouchableOpacity>

        {/* Notas y Recordatorios */}
        <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.cardTitleRow}>
            <RecordatoriosIcon size={18} color={Colors.PRIMARY_GREEN} />
            <Text style={[styles.sectionTitle, { color: t.title }]}>Notas y Recordatorios</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />

          {cultivo.Notas ? (
            <Text style={[styles.notasText, { color: t.subtitle }]}>{cultivo.Notas}</Text>
          ) : (
            <Text style={[styles.emptyText, { color: t.subtitle }]}>Sin notas registradas.</Text>
          )}

          <Text style={[styles.subSectionTitle, { color: t.title }]}>Recordatorios Próximos</Text>
          {recordatoriosDelCultivo.length === 0 ? (
            <Text style={[styles.emptyText, { color: t.subtitle }]}>Sin recordatorios próximos.</Text>
          ) : (
            recordatoriosDelCultivo.map((rec) => (
              <View key={rec.Recordatorio_id} style={styles.reminderRow}>
                <View style={[styles.checkbox, { borderColor: t.border }]}>
                  {rec.Cancelado && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <CalendarIcon size={15} color={t.subtitle} />
                <Text style={[styles.reminderText, { color: t.title }]}>
                  {rec.Titulo}{" "}
                  <Text style={[styles.reminderDate, { color: t.subtitle }]}>— {formatDate(rec.Recordar)}</Text>
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
};

function formatDate(date: string) {
  const dateObject = new Date(date);
  return new Intl.DateTimeFormat("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
    .format(dateObject)
    .toString();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 40, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  heroCard: {
    borderRadius: 16,
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

  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
    borderWidth: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  divider: { height: 1, marginVertical: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "600" },

  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  daysRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 14, flex: 1 },
  value: { fontSize: 14, fontWeight: "600" },

  progressBackground: {
    height: 8,
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
  progressLabel: { fontSize: 11 },

  notasText: { fontSize: 13, lineHeight: 19 },
  emptyText: { fontSize: 13, fontStyle: "italic" },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  reminderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: { color: "#fff", fontSize: 11, fontWeight: "700" },
  reminderText: { fontSize: 13, flex: 1 },
  reminderDate: { fontSize: 12 },

  historialBtn: {
    backgroundColor: Colors.PRIMARY_GREEN,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  historialBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cosechaRow: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    gap: 2,
  },
  cosechaInfo: { flexDirection: "row", justifyContent: "space-between" },
  cosechaFecha: { fontSize: 13 },
  cosechaCantidad: { fontSize: 13, fontWeight: "600" },
  cosechaObs: { fontSize: 12, fontStyle: "italic" },
});

export default CultivosDetail;
