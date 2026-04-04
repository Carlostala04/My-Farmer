/**
 * Pantalla de Animales (animals.tsx)
 *
 * Muestra la lista de animales del usuario autenticado obtenida desde el backend.
 * Se reemplazó el array de datos hardcodeados por el hook `useAnimales`, que
 * maneja el fetch, el estado de carga y los errores de forma centralizada.
 *
 * Cambios respecto a la versión anterior:
 *  - Se eliminaron los datos de prueba estáticos.
 *  - Se integró `useAnimales` para cargar datos reales del usuario.
 *  - Se agregó un indicador de carga (ActivityIndicator) mientras se obtienen los datos.
 *  - Se muestra un mensaje de error si el backend falla.
 *  - El filtrado de búsqueda ahora opera sobre los datos reales.
 */

import React, { useState, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import NavBar from "@/components/navBar";
import Card from "@/components/card";
import { useRouter } from "expo-router";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import { useAnimales } from "@/hooks/useAnimales";

export default function AnimalsScreen() {
  const [buscar, setBuscar] = useState("");
  const router = useRouter();
  const { t } = useTheme();

  // Hook que obtiene los animales reales del backend usando el token de Supabase
  const { animales, loading, error } = useAnimales();

  // Filtrado local sobre los datos traídos del servidor
  const filteredData = useMemo(() => {
    const query = buscar.trim().toLowerCase();
    if (!query) return animales;
    return animales.filter(
      (animal) =>
        animal.Nombre.toLowerCase().includes(query) ||
        (animal.Raza ?? "").toLowerCase().includes(query) ||
        (animal.Estado_Label ?? "").toLowerCase().includes(query),
    );
  }, [buscar, animales]);

  return (
    <>
      <ScreenHeader
        title="Animales"
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
            onPress: () => router.push("/(tabs)/registerAnimal"),
          },
        ]}
      />
      <NavBar />
      <View style={[styles.content, { backgroundColor: t.bg, flex: 1 }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: t.input,
              borderColor: t.border,
              color: t.title,
            },
          ]}
          value={buscar}
          placeholder="Buscar animales..."
          placeholderTextColor={t.placeholder}
          onChangeText={setBuscar}
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
            keyExtractor={(item) => String(item.Animal_id)}
            contentContainerStyle={{ paddingBottom: 140 }}
            renderItem={({ item }) => (
              <Card
                Nombre={item.Nombre}
                Fecha_Nacimiento={item.Fecha_Nacimiento}
                Estado_Label={item.Estado_Label}
                Foto={item.Foto}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/animailsDetails",
                    params: {
                      animal_id: item.Animal_id,
                      nombre: item.Nombre,
                      fecha_nacimiento: item.Fecha_Nacimiento ?? "",
                      estado: item.Estado_Label ?? "",
                      raza: item.Raza ?? "",
                      color: item.Color ?? "",
                      peso: item.Peso ?? "",
                      foto: item.Foto ?? "",
                    },
                  })
                }
              />
            )}
            ListEmptyComponent={
              !error ? (
                <Text style={[styles.emptyText, { color: t.subtitle }]}>
                  No hay animales registrados.
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
