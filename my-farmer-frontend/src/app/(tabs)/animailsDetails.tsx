/**
 * Pantalla de Detalle de Animal (animailsDetails.tsx)
 *
 * Cambios respecto a la versión anterior:
 *  - Se reemplazaron los datos hardcodeados por datos reales del backend.
 *  - Se recibe `animal_id` como parámetro de navegación y se carga el animal
 *    completo desde el backend usando `getAnimalById`.
 *  - Se cargan los recordatorios del animal usando `useRecordatorios`, filtrando
 *    por Entidad_Tipo === 'animal' y Entidad_id === animal_id.
 *  - El botón de eliminar ahora llama al backend usando `eliminarAnimal` y luego
 *    regresa a la pantalla anterior.
 *  - Se muestra un indicador de carga mientras se obtienen los datos.
 *  - Las notas mostradas vienen del campo `Notas` del animal en el backend.
 *  - Se adapta al modo oscuro y claro usando useTheme.
 *  - El icono de campana 🔔 fue reemplazado por un SVG.
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
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import Colors from "@/constants/colors";
import ScreenHeader from "@/components/header";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import DeleteIcon from "@/components/ui/deleteIcon";
import EditIcon from "@/components/ui/editIcon";
import { useAuth } from "@/supabase/useAuth";
import { getAnimalById } from "@/services/animalesService";
import { eliminarAnimal } from "@/services/animalesService";
import { useRecordatorios } from "@/hooks/useRecordatorios";
import { useEventosAnimales } from "@/hooks/useEventosAnimales";
import { ResponseAnimalDto } from "@/ts/animalsProps";
import type { ResponseEventoAnimalDto } from "@/ts/eventoAnimal";
import { useTheme } from "@/contexts/ThemeContext";
import { RecordatoriosIcon } from "@/components/ui/recordatorios_icon";

const AnimalsDetails = () => {
  const router = useRouter();
  const { session } = useAuth();
  const { t } = useTheme();

  // Parámetros que vienen desde la pantalla de lista de animales
  const { animal_id, foto: fotoFallback } = useLocalSearchParams<{
    animal_id: string;
    foto: string;
  }>();

  const [animal, setAnimal] = useState<ResponseAnimalDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  // Hook de recordatorios para filtrar los de este animal
  const { recordatorios } = useRecordatorios();

  // Hook de eventos para este animal
  const {
    eventos,
    loading: loadingEventos,
    refetch: refetchEventos,
    eliminarEvento,
  } = useEventosAnimales(Number(animal_id));

  // Recargar eventos cada vez que la pantalla recibe el foco (ej: al volver de registerEvento)
  useFocusEffect(
    useCallback(() => {
      refetchEventos();
    }, [refetchEventos]),
  );

  // Recordatorios que pertenecen a este animal específico
  const recordatoriosDelAnimal = recordatorios.filter(
    (r) =>
      r.Entidad_Tipo === "animal" &&
      r.Entidad_id === Number(animal_id) &&
      !r.Cancelado,
  );

  // Cargar datos completos del animal desde el backend
  useEffect(() => {
    if (!session?.access_token || !animal_id) return;

    setLoading(true);
    getAnimalById(Number(animal_id), session.access_token)
      .then(setAnimal)
      .catch(() => {
        Alert.alert("Error", "No se pudo cargar el animal.");
      })
      .finally(() => setLoading(false));
  }, [animal_id, session?.access_token]);

  /** Confirma y elimina el animal del backend, luego regresa a la lista. */
  const handleEliminar = () => {
    if (!session?.access_token || !animal_id) return;
    Alert.alert(
      "Eliminar Animal",
      `¿Estás seguro de que deseas eliminar a ${animal?.Nombre ?? "este animal"}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setEliminando(true);
            try {
              await eliminarAnimal(Number(animal_id), session.access_token!);
              router.back();
            } catch (e: any) {
              Alert.alert(
                "Error",
                e.message ?? "No se pudo eliminar el animal.",
              );
            } finally {
              setEliminando(false);
            }
          },
        },
      ],
    );
  };

  /** Confirma y elimina un evento del animal. */
  const handleEliminarEvento = (ev: ResponseEventoAnimalDto) => {
    Alert.alert(
      "Eliminar Evento",
      `¿Deseas eliminar "${ev.Titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const ok = await eliminarEvento(ev.Evento_id);
            if (!ok) Alert.alert("Error", "No se pudo eliminar el evento.");
          },
        },
      ],
    );
  };

  /** Calcula edad en años a partir de fecha de nacimiento. */
  const calcularEdad = (fecha: string | null): string => {
    if (!fecha) return "Desconocida";
    const años = new Date().getFullYear() - new Date(fecha).getFullYear();
    return años < 1 ? "Menos de 1 año" : `${años} año${años !== 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <>
        <ScreenHeader title="Detalles Animal" />
        <View style={[styles.centered, { backgroundColor: t.bg }]}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  if (!animal) {
    return (
      <>
        <ScreenHeader title="Detalles Animal" />
        <View style={[styles.centered, { backgroundColor: t.bg }]}>
          <Text style={{ color: t.subtitle }}>Animal no encontrado.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <ScreenHeader
        title="Detalles Animal"
        actions={[
          {
            icon: <EditIcon width={22} height={22} />,
            onPress: () =>
              router.push({
                pathname: "/(tabs)/registerAnimal",
                params: { animal_id: String(animal.Animal_id) },
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
        {/* Foto y nombre */}
        <View style={[styles.about_container, { backgroundColor: t.card, borderColor: t.border }]}>
          <Image
            source={{ uri: animal.Foto ?? fotoFallback ?? undefined }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.animalName, { color: t.title }]}>{animal.Nombre}</Text>
            <Text style={[styles.animalRaza, { color: t.subtitle }]}>
              {animal.Categoria ?? "Animal"}
              {animal.Raza ? ` · ${animal.Raza}` : ""}
            </Text>
            {animal.Estado_Label && (
              <View
                style={[
                  styles.estadoBadge,
                  { backgroundColor: Colors.PRIMARY_GREEN },
                ]}
              >
                <Text style={styles.estadoBadgeText}>
                  {animal.Estado_Label}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Detalles Físicos */}
        <View style={[styles.details_section, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.sectionTitle, { color: t.title }]}>Detalles Físicos</Text>
          <View style={[styles.divider, { backgroundColor: t.border }]} />
          <View style={styles.animal_details}>
            <View style={styles.details}>
              <Text style={[styles.label, { color: t.subtitle }]}>Edad:</Text>
              <Text style={[styles.value, { color: t.title }]}>
                {calcularEdad(animal.Fecha_Nacimiento)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={[styles.label, { color: t.subtitle }]}>Sexo:</Text>
              <Text style={[styles.value, { color: t.title }]}>{animal.Sexo ?? "—"}</Text>
            </View>
            <View style={styles.details}>
              <Text style={[styles.label, { color: t.subtitle }]}>Peso:</Text>
              <Text style={[styles.value, { color: t.title }]}>
                {animal.Peso != null
                  ? `${animal.Peso} ${animal.Peso_Unidad ?? "kg"}`
                  : "—"}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={[styles.label, { color: t.subtitle }]}>Altura:</Text>
              <Text style={[styles.value, { color: t.title }]}>
                {animal.Altura != null ? `${animal.Altura} cm` : "—"}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={[styles.label, { color: t.subtitle }]}>Color:</Text>
              <Text style={[styles.value, { color: t.title }]}>{animal.Color ?? "—"}</Text>
            </View>
            <View style={styles.details}>
              <Text style={[styles.label, { color: t.subtitle }]}>Parcela:</Text>
              <Text style={[styles.value, { color: t.title }]}>
                {animal.Parcela ?? "Sin asignar"}
              </Text>
            </View>
          </View>
        </View>

        {/* Notas y Recordatorios */}
        <View style={[styles.extras, { backgroundColor: t.card, borderColor: t.border }]}>
          {/* Notas del backend */}
          {animal.Notas && (
            <View style={styles.notasSection}>
              <Text style={[styles.sectionTitle, { color: t.title }]}>Notas</Text>
              <View style={[styles.divider, { backgroundColor: t.border }]} />
              <Text style={[styles.notasText, { color: t.subtitle }]}>{animal.Notas}</Text>
            </View>
          )}

          {/* Recordatorios del backend filtrados por este animal */}
          <View style={styles.rediminders}>
            <Text style={[styles.sectionTitle, { color: t.title }]}>Próximos Recordatorios</Text>
            <View style={[styles.divider, { backgroundColor: t.border }]} />
            {recordatoriosDelAnimal.length === 0 ? (
              <Text style={[styles.emptyText, { color: t.subtitle }]}>Sin recordatorios próximos.</Text>
            ) : (
              recordatoriosDelAnimal.map((rec) => (
                <View key={rec.Recordatorio_id} style={styles.reminderRow}>
                  <RecordatoriosIcon size={16} color={Colors.PRIMARY_GREEN} />
                  <Text style={[styles.reminderText, { color: t.title }]}>
                    {rec.Titulo}{" "}
                    <Text style={[styles.reminderDate, { color: t.subtitle }]}>— {formatDate(rec.Recordar)}</Text>
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* ── Eventos del Animal ─────────────────────────────────────────── */}
        <View style={[styles.extras, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.eventosHeader}>
            <Text style={[styles.sectionTitle, { color: t.title }]}>Eventos</Text>
            <TouchableOpacity
              style={styles.addEventoBtn}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/registerEvento" as any,
                  params: {
                    animal_id: String(animal_id),
                    animal_nombre: animal?.Nombre ?? "",
                  },
                })
              }
            >
              <Text style={styles.addEventoBtnText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.divider, { backgroundColor: t.border }]} />

          {loadingEventos ? (
            <ActivityIndicator
              size="small"
              color={Colors.PRIMARY_GREEN}
              style={{ marginVertical: 8 }}
            />
          ) : eventos.length === 0 ? (
            <Text style={[styles.emptyText, { color: t.subtitle }]}>
              Sin eventos registrados.
            </Text>
          ) : (
            eventos.map((ev) => (
              <View
                key={ev.Evento_id}
                style={[styles.eventoRow, { borderBottomColor: t.border }]}
              >
                {/* Parte izquierda: navega a edición */}
                <TouchableOpacity
                  style={styles.eventoRowContent}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/registerEvento" as any,
                      params: {
                        animal_id: String(animal_id),
                        evento_id: String(ev.Evento_id),
                        animal_nombre: animal?.Nombre ?? "",
                      },
                    })
                  }
                >
                  <View
                    style={[
                      styles.tipoBadge,
                      { backgroundColor: tipoColor(ev.Tipo) },
                    ]}
                  >
                    <Text style={styles.tipoBadgeText}>
                      {tipoLabel(ev.Tipo)}
                    </Text>
                  </View>
                  <View style={styles.eventoInfo}>
                    <Text
                      style={[styles.eventoTitulo, { color: t.title }]}
                      numberOfLines={1}
                    >
                      {ev.Titulo}
                    </Text>
                    <Text style={[styles.eventoFecha, { color: t.subtitle }]}>
                      {formatDate(ev.Fecha)}
                      {ev.Descripcion ? ` · ${ev.Descripcion}` : ""}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Botón eliminar */}
                <TouchableOpacity
                  onPress={() => handleEliminarEvento(ev)}
                  style={styles.eventoDeleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <DeleteIcon width={16} height={16} />
                </TouchableOpacity>
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

const TIPO_LABELS: Record<string, string> = {
  vacuna: "Vacuna",
  revision: "Revisión",
  tratamiento: "Tratamiento",
  alimentacion: "Alimentación",
  otro: "Otro",
};

const TIPO_COLORS: Record<string, string> = {
  vacuna: "#3B82F6",
  revision: "#8B5CF6",
  tratamiento: "#F97316",
  alimentacion: "#22C55E",
  otro: "#6B7280",
};

function tipoLabel(tipo: string): string {
  return TIPO_LABELS[tipo] ?? tipo;
}

function tipoColor(tipo: string): string {
  return TIPO_COLORS[tipo] ?? "#6B7280";
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 32, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  about_container: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0E0E0",
  },
  profileInfo: { flex: 1, gap: 4 },
  animalName: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  animalRaza: { fontSize: 13 },
  estadoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  estadoBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  details_section: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
  },
  divider: { height: 1, marginBottom: 12 },
  animal_details: { gap: 6 },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  label: { fontSize: 14 },
  value: { fontSize: 14, fontWeight: "500" },

  extras: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
    borderWidth: 1,
  },
  notasSection: { gap: 0 },
  notasText: { fontSize: 14, lineHeight: 20 },
  rediminders: { gap: 0 },
  emptyText: { fontSize: 13, fontStyle: "italic" },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reminderText: { fontSize: 14, flex: 1 },
  reminderDate: { fontSize: 13 },

  // ── Eventos ──────────────────────────────────────────────────────────────
  eventosHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addEventoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY_GREEN,
  },
  addEventoBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  eventoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  eventoRowContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tipoBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  eventoInfo: { flex: 1 },
  eventoTitulo: { fontSize: 14, fontWeight: "600" },
  eventoFecha: { fontSize: 12, marginTop: 1 },
  eventoDeleteBtn: { padding: 4 },
});

export default AnimalsDetails;
