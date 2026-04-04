/**
 * Pantalla de Cultivos (cultivos.tsx)
 *
 * Muestra la lista de cultivos activos del usuario autenticado obtenida desde el backend.
 * Se reemplazó el array de datos hardcodeados por el hook `useCultivos`, que
 * maneja el fetch, el estado de carga y los errores de forma centralizada.
 *
 * Cambios respecto a la versión anterior:
 *  - Se eliminaron los datos de prueba estáticos.
 *  - Se integró `useCultivos` para cargar cultivos reales del usuario.
 *  - Se agregó un indicador de carga (ActivityIndicator) mientras se obtienen los datos.
 *  - Se muestra un mensaje de error si el backend falla.
 *  - El filtrado de búsqueda ahora opera sobre los datos reales del servidor.
 *  - Los parámetros de navegación al detalle se mapean desde ResponseCultivoDto.
 */

import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import NavBar from "@/components/navBar";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import CardCultivos from "@/components/card-cultivos";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useCultivos } from "@/hooks/useCultivos";

export default function CultivosScreen() {
  const [buscar, setBuscar] = useState("");
  const router = useRouter();
  const { t } = useTheme();

  // Hook que obtiene los cultivos activos del usuario desde el backend
  const { cultivos, loading, error } = useCultivos();

  // Filtrado local sobre los datos traídos del servidor
  const filteredData = useMemo(() => {
    const query = buscar.trim().toLowerCase();
    if (!query) return cultivos;
    return cultivos.filter(
      (cultivo) =>
        cultivo.Nombre.toLowerCase().includes(query) ||
        (cultivo.Parcela ?? "").toLowerCase().includes(query),
    );
  }, [buscar, cultivos]);

  return (
    <>
      <NavBar />
      <ScreenHeader
        title="Cultivos"
        actions={[
          {
            icon: (
              <FilterIcon
                width={22}
                height={22}
                style={{ position: "absolute", top: 18, right: 20 }}
              />
            ),
            onPress: () => console.log("filtrar"),
          },
          {
            icon: (
              <Text
                style={{
                  fontSize: 35,
                  color: Colors.PRIMARY_GREEN,
                  fontWeight: "600",
                }}
              >
                +
              </Text>
            ),
            onPress: () => router.push("/(tabs)/registerCultivos"),
          },
        ]}
      />
      <View style={[styles.content, { backgroundColor: t.bg, flex: 1 }]}>
        <TextInput
          placeholder="Buscar cultivo..."
          value={buscar}
          onChangeText={setBuscar}
          placeholderTextColor={t.placeholder}
          style={[
            styles.input,
            {
              backgroundColor: t.input,
              borderColor: t.border,
              color: t.title,
            },
          ]}
        />

        {/* Indicador de carga mientras se obtienen los datos del servidor */}
        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.PRIMARY_GREEN}
            style={{ marginTop: 32 }}
          />
        )}

        {/* Mensaje de error si el backend no responde correctamente */}
        {error && !loading && <Text style={styles.errorText}>{error}</Text>}

        {!loading && (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => String(item.Cultivo_id)}
            contentContainerStyle={{ paddingBottom: 140 }}
            renderItem={({ item }) => (
              <CardCultivos
                Nombre={item.Nombre}
                Fecha_Siembra={item.Fecha_Siembra}
                Parcela={item.Parcela}
                Foto={item.Foto}
                Activo={item.Activo}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/cultivosDetails",
                    params: {
                      cultivo_id: item.Cultivo_id,
                      nombre: item.Nombre,
                      fechaSiembra: item.Fecha_Siembra ?? "",
                      ubicacion: item.Parcela ?? "",
                      estado: String(item.Activo),
                      imagen: item.Foto ?? "",
                    },
                  })
                }
              />
            )}
            ListEmptyComponent={
              !error ? (
                <Text style={[styles.emptyText, { color: t.subtitle }]}>
                  No hay cultivos activos registrados.
                </Text>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 120,
    gap: 8,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.CARD_DETAILS,
    borderColor: Colors.INPUT_BORDER,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.TITLE,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 14,
  },
});
