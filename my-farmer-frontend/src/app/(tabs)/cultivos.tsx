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
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import NavBar from "@/components/navBar";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import CardCultivos from "@/components/card-cultivos";
import Colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useCultivos } from "@/hooks/useCultivos";

type OrdenFecha = "siembra" | "cosecha" | null;

export default function CultivosScreen() {
  const [buscar, setBuscar] = useState("");
  const [ordenFecha, setOrdenFecha] = useState<OrdenFecha>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const router = useRouter();
  const { t } = useTheme();

  const { cultivos, loading, error } = useCultivos();

  const filteredData = useMemo(() => {
    let data = [...cultivos];

    if (ordenFecha === "siembra") {
      data.sort((a, b) => {
        const dateA = a.Fecha_Siembra ? new Date(a.Fecha_Siembra).getTime() : 0;
        const dateB = b.Fecha_Siembra ? new Date(b.Fecha_Siembra).getTime() : 0;
        return dateB - dateA;
      });
    } else if (ordenFecha === "cosecha") {
      data.sort((a, b) => {
        const dateA = a.Fecha_Cosecha_Estimada
          ? new Date(a.Fecha_Cosecha_Estimada).getTime()
          : 0;
        const dateB = b.Fecha_Cosecha_Estimada
          ? new Date(b.Fecha_Cosecha_Estimada).getTime()
          : 0;
        return dateB - dateA;
      });
    }

    const query = buscar.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (cultivo) =>
        cultivo.Nombre.toLowerCase().includes(query) ||
        (cultivo.Parcela ?? "").toLowerCase().includes(query),
    );
  }, [buscar, cultivos, ordenFecha]);

  const opcionesOrden: { label: string; value: OrdenFecha }[] = [
    { label: "Sin orden", value: null },
    { label: "Fecha de siembra (más reciente)", value: "siembra" },
    { label: "Fecha de cosecha (más reciente)", value: "cosecha" },
  ];

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

      {/* Modal de filtro por fecha */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContainer, { backgroundColor: t.card }]}>
                <Text style={[styles.modalTitle, { color: t.title }]}>
                  Ordenar por fecha
                </Text>

                {opcionesOrden.map((op) => (
                  <TouchableOpacity
                    key={String(op.value)}
                    style={[
                      styles.opcionBtn,
                      { borderColor: t.border },
                      ordenFecha === op.value && styles.opcionBtnActivo,
                    ]}
                    onPress={() => {
                      setOrdenFecha(op.value);
                      setFilterModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.opcionBtnText,
                        { color: t.subtitle },
                        ordenFecha === op.value && styles.opcionBtnTextActivo,
                      ]}
                    >
                      {op.label}
                    </Text>
                  </TouchableOpacity>
                ))}

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
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  opcionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  opcionBtnActivo: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderColor: Colors.PRIMARY_GREEN,
  },
  opcionBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
  opcionBtnTextActivo: {
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
