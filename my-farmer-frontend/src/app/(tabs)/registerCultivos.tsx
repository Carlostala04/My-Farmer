/**
 * Formulario de Registro/Edición de Cultivo (registerCultivos.tsx)
 *
 * Permite al usuario crear un nuevo cultivo o editar uno existente.
 * - En modo creación: no recibe parámetros, guarda con crearCultivo.
 * - En modo edición: recibe `cultivo_id` como parámetro de navegación,
 *   carga los datos del cultivo y pre-rellena el formulario. Al guardar
 *   llama a actualizarCultivo con los campos modificados.
 */

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";
import Dropdown from "@/components/dropdown";
import { EstadoCultivo, ResponseCultivoDto } from "@/ts/cultivoProps";
import { useCultivos } from "@/hooks/useCultivos";
import { useTiposCultivo } from "@/hooks/useTiposCultivo";
import { useParcelas } from "@/hooks/useParcelas";
import { useAuth } from "@/supabase/useAuth";
import { getCultivoById, actualizarCultivo } from "@/services/cultivosService";

export default function RegisterCultivosScreen() {
  const router = useRouter();
  const { session } = useAuth();

  // Recibe cultivo_id cuando viene desde la pantalla de detalles (modo edición)
  const { cultivo_id } = useLocalSearchParams<{ cultivo_id?: string }>();
  const modoEdicion = !!cultivo_id;

  // Hook para crear cultivos en el backend
  const { crearCultivo, loading: loadingCrear } = useCultivos();

  // Estado de carga para modo edición
  const [guardando, setGuardando] = useState(false);
  const [cargandoCultivo, setCargandoCultivo] = useState(false);

  // Opciones dinámicas desde el backend
  const { tipos } = useTiposCultivo();
  const { parcelas } = useParcelas();

  const estadoOpciones = [
    {
      id: 1,
      nombre: "En crecimiento",
      value: "en_crecimiento" as EstadoCultivo,
    },
    { id: 2, nombre: "Cosechado", value: "cosechado" as EstadoCultivo },
  ];
  const rendimientoUnidadOpciones = [
    { id: 1, nombre: "kg" },
    { id: 2, nombre: "ton" },
    { id: 3, nombre: "lb" },
    { id: 4, nombre: "qq" },
    { id: 5, nombre: "unidades" },
  ];

  // Opciones de tipos de cultivo mapeadas para el componente Dropdown
  const tiposOpciones = tipos.map((t) => ({
    id: t.Tipo_Cultivo_id,
    nombre: t.Nombre,
  }));

  // Opciones de parcelas mapeadas para el componente Dropdown
  const parcelasOpciones = parcelas.map((p) => ({
    id: p.Parcela_id,
    nombre: p.Nombre,
  }));

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState(0);
  const [fechaSiembra, setFechaSiembra] = useState("");
  const [ubicacion, setUbicacion] = useState(0);
  const [estado, setEstado] = useState<EstadoCultivo>("en_crecimiento");
  const [fechaCosechaEstimada, setFechaCosechaEstimada] = useState("");
  const [rendimientoEstimado, setRendimientoEstimado] = useState("");
  const [rendimientoUnidad, setRendimientoUnidad] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);

  // DatePickers para fechas
  const [showSiembraPicker, setShowSiembraPicker] = useState(false);
  const [siembraPickerValue, setSiembraPickerValue] = useState(new Date());
  const [showCosechaPicker, setShowCosechaPicker] = useState(false);
  const [cosechaPickerValue, setCosechaPickerValue] = useState(new Date());

  const formatDateYMD = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleSiembraChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowSiembraPicker(false);
    if (date && event.type !== "dismissed") {
      setSiembraPickerValue(date);
      setFechaSiembra(formatDateYMD(date));
    }
  };

  const handleCosechaChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowCosechaPicker(false);
    if (date && event.type !== "dismissed") {
      setCosechaPickerValue(date);
      setFechaCosechaEstimada(formatDateYMD(date));
    }
  };

  // Datos del cultivo cargado para edición
  const [cultivoEditData, setCultivoEditData] = useState<ResponseCultivoDto | null>(null);

  // En modo edición: cargar datos del cultivo desde el backend
  useEffect(() => {
    if (!modoEdicion || !session?.access_token || !cultivo_id) return;
    setCargandoCultivo(true);
    getCultivoById(Number(cultivo_id), session.access_token)
      .then(setCultivoEditData)
      .catch(() => Alert.alert("Error", "No se pudo cargar el cultivo."))
      .finally(() => setCargandoCultivo(false));
  }, [modoEdicion, cultivo_id, session?.access_token]);

  // Pre-rellenar el formulario cuando los datos del cultivo Y las listas estén listas
  useEffect(() => {
    if (!cultivoEditData || tipos.length === 0) return;

    setNombre(cultivoEditData.Nombre);
    setEstado((cultivoEditData.Estado as EstadoCultivo) ?? "en_crecimiento");

    const fechaSiem = cultivoEditData.Fecha_Siembra ?? "";
    setFechaSiembra(fechaSiem);
    if (fechaSiem) {
      const parsed = new Date(fechaSiem);
      if (!isNaN(parsed.getTime())) setSiembraPickerValue(parsed);
    }

    const fechaCos = cultivoEditData.Fecha_Cosecha_Estimada ?? "";
    setFechaCosechaEstimada(fechaCos);
    if (fechaCos) {
      const parsed = new Date(fechaCos);
      if (!isNaN(parsed.getTime())) setCosechaPickerValue(parsed);
    }
    setRendimientoEstimado(
      cultivoEditData.Rendimiento_Estimado != null
        ? String(cultivoEditData.Rendimiento_Estimado)
        : "",
    );
    setRendimientoUnidad(cultivoEditData.Rendimiento_Unidad ?? "");
    setObservaciones(cultivoEditData.Notas ?? "");
    setImagen(cultivoEditData.Foto ?? null);

    // Mapear nombre de tipo cultivo → ID
    const tipoCultivo = tipos.find((t) => t.Nombre === cultivoEditData.Tipo_Cultivo);
    if (tipoCultivo) setTipo(tipoCultivo.Tipo_Cultivo_id);

    // Mapear nombre de parcela → ID
    const parc = parcelas.find((p) => p.Nombre === cultivoEditData.Parcela);
    if (parc) setUbicacion(parc.Parcela_id);
  }, [cultivoEditData, tipos, parcelas]);

  const handleSeleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Se necesita acceso a la galería para seleccionar una imagen.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleTomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso requerido",
        "Se necesita acceso a la cámara para tomar una foto.",
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleAgregarImagen = () => {
    Alert.alert("Agregar imagen", "¿Cómo deseas agregar la imagen?", [
      { text: "Galería", onPress: handleSeleccionarImagen },
      { text: "Cámara", onPress: handleTomarFoto },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  /**
   * Valida los campos obligatorios y guarda el cultivo (crea o actualiza).
   */
  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del cultivo es obligatorio.");
      return;
    }
    if (!tipo) {
      Alert.alert("Error", "El tipo de cultivo es obligatorio.");
      return;
    }

    if (modoEdicion) {
      // Modo edición: llamar al servicio directamente
      if (!session?.access_token) return;
      setGuardando(true);
      try {
        await actualizarCultivo(
          Number(cultivo_id),
          {
            Nombre: nombre.trim(),
            Estado: estado,
            Fecha_Siembra: fechaSiembra.trim() || null,
            Fecha_Cosecha_Estimada: fechaCosechaEstimada.trim() || null,
            Rendimiento_Estimado: rendimientoEstimado
              ? parseFloat(rendimientoEstimado)
              : null,
            Rendimiento_Unidad: rendimientoUnidad || null,
            Notas: observaciones.trim() || null,
            Parcela_id: ubicacion || null,
            Tipo_Cultivo_id: tipo || null,
          },
          session.access_token,
        );
        Alert.alert("Éxito", "Cultivo actualizado correctamente.");
        router.back();
      } catch (e: any) {
        Alert.alert("Error", e.message ?? "No se pudo actualizar el cultivo.");
      } finally {
        setGuardando(false);
      }
    } else {
      // Modo creación
      const ok = await crearCultivo(
        {
          Nombre: nombre.trim(),
          Estado: estado,
          Fecha_Siembra: fechaSiembra.trim() || null,
          Fecha_Cosecha_Estimada: fechaCosechaEstimada.trim() || null,
          Rendimiento_Estimado: rendimientoEstimado
            ? parseFloat(rendimientoEstimado)
            : null,
          Rendimiento_Unidad: rendimientoUnidad || null,
          Notas: observaciones.trim() || null,
          Parcela_id: ubicacion || null,
          Tipo_Cultivo_id: tipo || null,
        },
        imagen ?? undefined,
      );

      if (ok) {
        Alert.alert("Éxito", "Cultivo registrado correctamente.");
        router.back();
      } else {
        Alert.alert(
          "Error",
          "No se pudo registrar el cultivo. Intenta de nuevo.",
        );
      }
    }
  };

  const loading = modoEdicion ? guardando : loadingCrear;

  if (cargandoCultivo) {
    return (
      <>
        <ScreenHeader title="Editar Cultivo" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title={modoEdicion ? "Editar Cultivo" : "Registrar Cultivo"} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del Cultivo */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleAgregarImagen}
        >
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={styles.imagePlaceholderIcon}>🌱</ThemedText>
              <ThemedText style={styles.imagePlaceholderText}>
                Agregar foto del cultivo
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>
        {imagen && (
          <TouchableOpacity onPress={() => setImagen(null)}>
            <ThemedText style={styles.removeImageText}>
              Eliminar imagen
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Datos Básicos */}
        <ThemedText style={styles.sectionTitle}>Datos Básicos</ThemedText>

        <ThemedText style={styles.label}>Nombre del Cultivo</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: Maíz del norte"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={nombre}
          onChangeText={setNombre}
        />
        <ThemedText style={styles.hint}>
          Nombre único para identificar este cultivo dentro de tu finca.
        </ThemedText>

        {/* Tipo de cultivo cargado dinámicamente desde el backend */}
        <ThemedText style={styles.label}>Tipo de Cultivo</ThemedText>
        <Dropdown
          data={tiposOpciones}
          placeholder="Ingrese el tipo de cultivo"
          value={tipo}
          onValueChange={(val) => setTipo(Number(val))}
        />
        <ThemedText style={styles.hint}>
          Especifica la especie o variedad del cultivo.
        </ThemedText>

        {/* Siembra y Ubicación */}
        <ThemedText style={styles.sectionTitle}>Siembra y Ubicación</ThemedText>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Fecha de Siembra</ThemedText>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowSiembraPicker(true)}
            >
              <ThemedText style={fechaSiembra ? styles.dateText : styles.datePlaceholder}>
                {fechaSiembra || "YYYY-MM-DD"}
              </ThemedText>
            </TouchableOpacity>
            {showSiembraPicker && (
              <DateTimePicker
                value={siembraPickerValue}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleSiembraChange}
              />
            )}
          </View>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Estado</ThemedText>
            <Dropdown
              data={estadoOpciones}
              placeholder="Seleccione un estado"
              value={estado}
              onValueChange={(val) => {
                const encontrado = estadoOpciones.find(
                  (o) => o.id === Number(val),
                );
                if (encontrado) setEstado(encontrado.value);
              }}
            />
          </View>
        </View>

        {/* Parcela cargada dinámicamente desde el backend */}
        <ThemedText style={styles.label}>Ubicación / Parcela</ThemedText>
        <Dropdown
          data={parcelasOpciones}
          placeholder="Seleccione una parcela"
          value={ubicacion}
          onValueChange={(val) => setUbicacion(Number(val))}
        />
        <ThemedText style={styles.hint}>
          Indica en qué zona o parcela de la finca se encuentra el cultivo.
        </ThemedText>

        {/* Cosecha */}
        <ThemedText style={styles.sectionTitle}>Cosecha</ThemedText>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Fecha cosecha</ThemedText>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCosechaPicker(true)}
            >
              <ThemedText style={fechaCosechaEstimada ? styles.dateText : styles.datePlaceholder}>
                {fechaCosechaEstimada || "YYYY-MM-DD"}
              </ThemedText>
            </TouchableOpacity>
            {showCosechaPicker && (
              <DateTimePicker
                value={cosechaPickerValue}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleCosechaChange}
              />
            )}
          </View>
        </View>

        <ThemedText style={styles.label}>Rendimiento estimado</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: 500"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          keyboardType="numeric"
          value={rendimientoEstimado}
          onChangeText={setRendimientoEstimado}
        />

        <ThemedText style={styles.label}>Unidad de rendimiento</ThemedText>
        <Dropdown
          data={rendimientoUnidadOpciones}
          placeholder="Seleccione una unidad"
          value={rendimientoUnidad}
          onValueChange={(val) => {
            const encontrado = rendimientoUnidadOpciones.find(
              (o) => o.id === Number(val),
            );
            if (encontrado) setRendimientoUnidad(encontrado.nombre);
          }}
        />

        {/* Notas Adicionales */}
        <ThemedText style={styles.sectionTitle}>Notas Adicionales</ThemedText>

        <ThemedText style={styles.label}>Observaciones</ThemedText>
        <TextInput
          style={styles.textArea}
          placeholder="Cualquier información relevante sobre el cultivo, condiciones del suelo, riego, fertilizantes, etc."
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          multiline
          numberOfLines={4}
          value={observaciones}
          onChangeText={setObservaciones}
        />

        {/* Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, loading && { opacity: 0.7 }]}
            onPress={handleGuardar}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.saveText}>
                {modoEdicion ? "Actualizar" : "Guardar"}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
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
    color: Colors.TITLE,
    marginTop: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.TITLE,
    marginBottom: 4,
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    color: Colors.PLACEHOLDER_GRAY,
    marginTop: 4,
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
  inputReadonly: {
    opacity: 0.5,
  },
  textArea: {
    width: "100%",
    minHeight: 100,
    backgroundColor: Colors.CARD_DETAILS,
    borderColor: Colors.INPUT_BORDER,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.TITLE,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
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
    borderColor: Colors.INPUT_BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.CARD_DETAILS,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.TITLE,
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
  imageContainer: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  imagePreview: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.INPUT_BORDER,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: Colors.INPUT_BORDER,
    borderStyle: "dashed",
    backgroundColor: Colors.CARD_DETAILS,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderIcon: {
    fontSize: 32,
  },
  imagePlaceholderText: {
    fontSize: 12,
    color: Colors.PLACEHOLDER_GRAY,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  removeImageText: {
    fontSize: 13,
    color: "#e53935",
    textAlign: "center",
    marginBottom: 4,
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
});
