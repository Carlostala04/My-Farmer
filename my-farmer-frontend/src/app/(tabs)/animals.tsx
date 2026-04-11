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
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import NavBar from "@/components/navBar";
import Card from "@/components/card";
import { useRouter } from "expo-router";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import { useAnimales } from "@/hooks/useAnimales";
import { useCategorias } from "@/hooks/useCategorias";

export default function AnimalsScreen() {
  const [buscar, setBuscar] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const router = useRouter();
  const { t } = useTheme();

  const { animales, loading, error } = useAnimales();
  const { categorias } = useCategorias();

  const filteredData = useMemo(() => {
    let data = animales;

    if (filtroCategoria) {
      data = data.filter((animal) => animal.Categoria === filtroCategoria);
    }

    const query = buscar.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (animal) =>
        animal.Nombre.toLowerCase().includes(query) ||
        (animal.Raza ?? "").toLowerCase().includes(query) ||
        (animal.Estado_Label ?? "").toLowerCase().includes(query) ||
        (animal.Color ?? "").toLowerCase().includes(query),
    );
  }, [buscar, animales, filtroCategoria]);

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
            onPress: () => setFilterModalVisible(true),
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

      {/* Modal de filtro por categoría */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContainer, { backgroundColor: t.card }]}>
                <Text style={[styles.modalTitle, { color: t.title }]}>
                  Filtrar por categoría
                </Text>

                <ScrollView contentContainerStyle={styles.categoriasContainer}>
                  <TouchableOpacity
                    style={[
                      styles.categoriaBtn,
                      { borderColor: t.border },
                      filtroCategoria === null && styles.categoriaBtnActivo,
                    ]}
                    onPress={() => {
                      setFiltroCategoria(null);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoriaBtnText,
                        { color: t.subtitle },
                        filtroCategoria === null && styles.categoriaBtnTextActivo,
                      ]}
                    >
                      Todas
                    </Text>
                  </TouchableOpacity>

                  {categorias.map((cat) => (
                    <TouchableOpacity
                      key={cat.Categoria_Animal_id}
                      style={[
                        styles.categoriaBtn,
                        { borderColor: t.border },
                        filtroCategoria === cat.Nombre && styles.categoriaBtnActivo,
                      ]}
                      onPress={() => {
                        setFiltroCategoria(cat.Nombre);
                        setFilterModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.categoriaBtnText,
                          { color: t.subtitle },
                          filtroCategoria === cat.Nombre &&
                            styles.categoriaBtnTextActivo,
                        ]}
                      >
                        {cat.Nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.cerrarBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.cerrarBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  categoriasContainer: {
    gap: 8,
  },
  categoriaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoriaBtnActivo: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderColor: Colors.PRIMARY_GREEN,
  },
  categoriaBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
  categoriaBtnTextActivo: {
    color: "#fff",
    fontWeight: "600",
  },
  cerrarBtn: {
    marginTop: 4,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  cerrarBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
