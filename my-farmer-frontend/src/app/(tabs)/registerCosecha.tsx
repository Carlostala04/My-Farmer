/**
 * Pantalla de Registro/Edición de Cosecha (registerCosecha.tsx)
 *
 * Permite registrar o editar una cosecha para un cultivo.
 * Recibe como parámetros:
 *  - cultivo_id  → ID del cultivo al que pertenece la cosecha (requerido)
 *  - cosecha_id  → ID de la cosecha a editar (opcional, si no se pasa es modo creación)
 *
 * Campos del formulario:
 *  - Fecha        → Fecha de la cosecha (YYYY-MM-DD, requerido)
 *  - Cantidad     → Cantidad cosechada (número, requerido)
 *  - Unidad       → Unidad de medida seleccionada con Dropdown (requerido)
 *  - Observaciones → Notas adicionales (texto, opcional)
 */

import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  Modal,
  Text,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/supabase/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";
import Dropdown from "@/components/dropdown";
import Colors from "@/constants/colors";
import {
  crearCosecha,
  actualizarCosecha,
  getCosechaById,
} from "@/services/cosechasService";

const unidadOpciones = [
  { id: 1, nombre: "kg" },
  { id: 2, nombre: "ton" },
  { id: 3, nombre: "lb" },
  { id: 4, nombre: "qq" },
  { id: 5, nombre: "unidades" },
];

export default function RegisterCosechaScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { t } = useTheme();
  const titleStyle = { color: t.title };
  const subtitleStyle = { color: t.subtitle };

  const { cultivo_id, cosecha_id } = useLocalSearchParams<{
    cultivo_id: string;
    cosecha_id?: string;
  }>();

  const esEdicion = Boolean(cosecha_id);

  const [fecha, setFecha] = useState("");
  const [fechaValue, setFechaValue] = useState(new Date());
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const formatDateYMD = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleFechaChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowFechaPicker(false);
    if (date && event.type !== "dismissed") {
      setFechaValue(date);
      setFecha(formatDateYMD(date));
    }
  };

  // Cargar datos existentes si es modo edición
  useEffect(() => {
    if (!esEdicion || !session?.access_token || !cosecha_id) return;
    setCargando(true);
    getCosechaById(Number(cosecha_id), session.access_token)
      .then((cos) => {
        if (cos.Fecha) {
          setFecha(cos.Fecha);
          const parsed = new Date(cos.Fecha);
          if (!isNaN(parsed.getTime())) setFechaValue(parsed);
        }
        setCantidad(String(cos.Cantidad));
        setUnidad(cos.Unidad ?? "");
        setObservaciones(cos.Observaciones ?? "");
      })
      .catch(() => Alert.alert("Error", "No se pudo cargar la cosecha."))
      .finally(() => setCargando(false));
  }, [esEdicion, cosecha_id, session?.access_token]);

  const handleGuardar = async () => {
    if (!session?.access_token || !cultivo_id) return;

    if (!fecha.trim()) {
      Alert.alert("Error", "La fecha es requerida.");
      return;
    }
    const cantidadNum = parseFloat(cantidad.trim());
    if (!cantidad.trim() || isNaN(cantidadNum)) {
      Alert.alert("Error", "Ingresa una cantidad válida.");
      return;
    }
    if (!unidad.trim()) {
      Alert.alert("Error", "Selecciona una unidad de medida.");
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion && cosecha_id) {
        await actualizarCosecha(
          Number(cosecha_id),
          {
            Fecha: fecha.trim(),
            Cantidad: cantidadNum,
            Unidad: unidad.trim(),
            Observaciones: observaciones.trim() || null,
          },
          session.access_token,
        );
      } else {
        await crearCosecha(
          {
            Cultivo_id: Number(cultivo_id),
            Fecha: fecha.trim(),
            Cantidad: cantidadNum,
            Unidad: unidad.trim(),
            Observaciones: observaciones.trim() || null,
          },
          session.access_token,
        );
      }
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo guardar la cosecha.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <>
        <ScreenHeader title={esEdicion ? "Editar Cosecha" : "Registrar Cosecha"} />
        <View style={[styles.centered, { backgroundColor: t.bg }]}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title={esEdicion ? "Editar Cosecha" : "Registrar Cosecha"} />
      <ScrollView
        style={[styles.scroll, { backgroundColor: t.bg }]}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText style={[styles.sectionTitle, titleStyle]}>Datos de la Cosecha</ThemedText>

        {/* Fecha */}
        <ThemedText style={[styles.label, titleStyle]}>Fecha de cosecha</ThemedText>
        <TouchableOpacity
          style={[styles.input, { backgroundColor: t.input, borderColor: t.border }]}
          onPress={() => setShowFechaPicker(true)}
        >
          <ThemedText
            style={[
              fecha ? styles.dateText : styles.datePlaceholder,
              { color: fecha ? t.title : t.placeholder },
            ]}
          >
            {fecha || "YYYY-MM-DD"}
          </ThemedText>
        </TouchableOpacity>

        {/* Android: diálogo nativo */}
        {showFechaPicker && Platform.OS === "android" && (
          <DateTimePicker
            value={fechaValue}
            mode="date"
            display="default"
            onChange={handleFechaChange}
          />
        )}

        {/* iOS: modal con fondo blanco para que el spinner sea visible */}
        {Platform.OS === "ios" && (
          <Modal
            visible={showFechaPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowFechaPicker(false)}
          >
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosPickerContainer}>
                <View style={styles.iosPickerHeader}>
                  <TouchableOpacity onPress={() => setShowFechaPicker(false)}>
                    <Text style={styles.iosPickerDone}>Listo</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={fechaValue}
                  mode="date"
                  display="spinner"
                  onChange={handleFechaChange}
                  textColor="#000000"
                  themeVariant="light"
                  style={styles.iosPicker}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Cantidad y Unidad */}
        <ThemedText style={[styles.sectionTitle, titleStyle]}>Producción</ThemedText>

        <ThemedText style={[styles.label, titleStyle]}>Cantidad</ThemedText>
        <TextInput
          style={[styles.input, { backgroundColor: t.input, borderColor: t.border, color: t.title }]}
          placeholder="Ej: 150"
          placeholderTextColor={t.placeholder}
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="decimal-pad"
        />

        <ThemedText style={[styles.label, titleStyle]}>Unidad de medida</ThemedText>
        <Dropdown
          data={unidadOpciones}
          placeholder="Seleccione una unidad"
          value={unidadOpciones.find((o) => o.nombre === unidad)?.id ?? ""}
          onValueChange={(val) => {
            const encontrado = unidadOpciones.find((o) => o.id === Number(val));
            if (encontrado) setUnidad(encontrado.nombre);
          }}
        />
        <ThemedText style={[styles.hint, subtitleStyle]}>
          Unidad en la que se mide la cantidad cosechada.
        </ThemedText>

        {/* Observaciones */}
        <ThemedText style={[styles.sectionTitle, titleStyle]}>Notas Adicionales</ThemedText>

        <ThemedText style={[styles.label, titleStyle]}>Observaciones</ThemedText>
        <TextInput
          style={[styles.textArea, { backgroundColor: t.input, borderColor: t.border, color: t.title }]}
          placeholder="Cualquier información adicional sobre la cosecha, calidad, condiciones, etc."
          placeholderTextColor={t.placeholder}
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: t.input, borderColor: t.border }]}
            onPress={() => router.back()}
            disabled={guardando}
          >
            <ThemedText style={[styles.cancelText, titleStyle]}>Cancelar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, guardando && { opacity: 0.7 }]}
            onPress={handleGuardar}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveText}>
                {esEdicion ? "Actualizar" : "Guardar"}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 6,
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    justifyContent: "center",
  },
  textArea: {
    width: "100%",
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    textAlignVertical: "top",
  },
  dateText: {
    fontSize: 15,
    color: Colors.TITLE,
    lineHeight: 50,
  },
  datePlaceholder: {
    fontSize: 15,
    color: Colors.PLACEHOLDER_GRAY,
    lineHeight: 50,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  // iOS date picker modal
  iosModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  iosPickerContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  iosPickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  iosPickerDone: {
    color: Colors.PRIMARY_GREEN,
    fontSize: 16,
    fontWeight: "600",
  },
  iosPicker: {
    backgroundColor: "#ffffff",
  },
});
