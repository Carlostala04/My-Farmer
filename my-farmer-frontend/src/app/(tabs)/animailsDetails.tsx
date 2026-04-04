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
import { useAuth } from "@/supabase/useAuth";
import { getAnimalById } from "@/services/animalesService";
import { eliminarAnimal } from "@/services/animalesService";
import { useRecordatorios } from "@/hooks/useRecordatorios";
import { ResponseAnimalDto } from "@/ts/animalsProps";

const AnimalsDetails = () => {
  const router = useRouter();
  const { session } = useAuth();

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
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  if (!animal) {
    return (
      <>
        <ScreenHeader title="Detalles Animal" />
        <View style={styles.centered}>
          <Text style={{ color: Colors.SUBTITLE }}>Animal no encontrado.</Text>
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
        {/* Foto y nombre */}
        <View style={styles.about_container}>
          <Image
            source={{ uri: animal.Foto ?? fotoFallback ?? undefined }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.animalName}>{animal.Nombre}</Text>
            <Text style={styles.animalRaza}>
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
        <View style={styles.details_section}>
          <Text style={styles.sectionTitle}>Detalles Físicos</Text>
          <View style={styles.divider} />
          <View style={styles.animal_details}>
            <View style={styles.details}>
              <Text style={styles.label}>Edad:</Text>
              <Text style={styles.value}>
                {calcularEdad(animal.Fecha_Nacimiento)}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Sexo:</Text>
              <Text style={styles.value}>{animal.Sexo ?? "—"}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Peso:</Text>
              <Text style={styles.value}>
                {animal.Peso != null
                  ? `${animal.Peso} ${animal.Peso_Unidad ?? "kg"}`
                  : "—"}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Altura:</Text>
              <Text style={styles.value}>
                {animal.Altura != null ? `${animal.Altura} cm` : "—"}
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Color:</Text>
              <Text style={styles.value}>{animal.Color ?? "—"}</Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.label}>Parcela:</Text>
              <Text style={styles.value}>
                {animal.Parcela ?? "Sin asignar"}
              </Text>
            </View>
          </View>
        </View>

        {/* Notas y Recordatorios */}
        <View style={styles.extras}>
          {/* Notas del backend */}
          {animal.Notas && (
            <View style={styles.notasSection}>
              <Text style={styles.sectionTitle}>Notas</Text>
              <View style={styles.divider} />
              <Text style={styles.notasText}>{animal.Notas}</Text>
            </View>
          )}

          {/* Recordatorios del backend filtrados por este animal */}
          <View style={styles.rediminders}>
            <Text style={styles.sectionTitle}>Próximos Recordatorios</Text>
            <View style={styles.divider} />
            {recordatoriosDelAnimal.length === 0 ? (
              <Text style={styles.emptyText}>Sin recordatorios próximos.</Text>
            ) : (
              recordatoriosDelAnimal.map((rec) => (
                <View key={rec.Recordatorio_id} style={styles.reminderRow}>
                  <Text style={styles.reminderIcon}>🔔</Text>
                  <Text style={styles.reminderText}>
                    {rec.Titulo}{" "}
                    <Text style={styles.reminderDate}>— {rec.Recordar}</Text>
                  </Text>
                </View>
              ))
            )}
          </View>
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
  contentContainer: { padding: 16, paddingBottom: 32, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  about_container: {
    ...cardStyle,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
    color: Colors.TITLE,
    letterSpacing: -0.3,
  },
  animalRaza: { fontSize: 13, color: Colors.SUBTITLE },
  estadoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  estadoBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  details_section: { ...cardStyle },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.TITLE,
    marginBottom: 10,
  },
  divider: { height: 1, backgroundColor: Colors.DIVIDER, marginBottom: 12 },
  animal_details: { gap: 6 },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  label: { fontSize: 14, color: Colors.LABEL },
  value: { fontSize: 14, fontWeight: "500", color: Colors.VALUE },

  extras: { ...cardStyle, gap: 16 },
  notasSection: { gap: 0 },
  notasText: { fontSize: 14, color: Colors.SUBTITLE, lineHeight: 20 },
  rediminders: { gap: 0 },
  emptyText: { fontSize: 13, color: Colors.SUBTITLE, fontStyle: "italic" },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  reminderIcon: { fontSize: 16 },
  reminderText: { fontSize: 14, color: Colors.VALUE, flex: 1 },
  reminderDate: { fontSize: 13, color: Colors.SUBTITLE },
});

export default AnimalsDetails;
