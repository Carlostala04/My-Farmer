/**
 * Formulario de Registro/Edición de Evento de Animal (registerEvento.tsx)
 *
 * Permite registrar un nuevo evento para un animal o editar uno existente.
 * - En modo creación: recibe animal_id (y opcionalmente animal_nombre para el header).
 * - En modo edición:  recibe animal_id + evento_id, carga el evento y pre-rellena el form.
 *
 * Navega hacia atrás al guardar correctamente; la pantalla de detalles recarga
 * los eventos mediante useFocusEffect.
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
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";
import Dropdown from "@/components/dropdown";
import { TipoEvento } from "@/ts/eventoAnimal";
import { useAuth } from "@/supabase/useAuth";
import {
  crearEvento,
  getEventoById,
  actualizarEvento,
} from "@/services/eventoAnimalService";

const TIPO_OPCIONES = [
  { id: 1, nombre: "Vacuna", value: "vacuna" as TipoEvento },
  { id: 2, nombre: "Revisión", value: "revision" as TipoEvento },
  { id: 3, nombre: "Tratamiento", value: "tratamiento" as TipoEvento },
  { id: 4, nombre: "Alimentación", value: "alimentacion" as TipoEvento },
  { id: 5, nombre: "Otro", value: "otro" as TipoEvento },
];

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function RegisterEventoScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const { animal_id, animal_nombre, evento_id } = useLocalSearchParams<{
    animal_id: string;
    animal_nombre?: string;
    evento_id?: string;
  }>();

  const modoEdicion = !!evento_id;
  const todayISO = toISO(new Date());

  // ── Estado del formulario ─────────────────────────────────────────────────
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState(todayISO);
  const [tipo, setTipo] = useState<TipoEvento | "">("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(false);

  // ── En modo edición: cargar datos del evento ──────────────────────────────
  useEffect(() => {
    if (!modoEdicion || !session?.access_token || !evento_id) return;
    setCargando(true);
    getEventoById(Number(evento_id), session.access_token)
      .then((ev) => {
        setTitulo(ev.Titulo);
        const fechaStr =
          typeof ev.Fecha === "string"
            ? ev.Fecha.split("T")[0]
            : todayISO;
        setFecha(fechaStr);
        setTipo(ev.Tipo);
        setDescripcion(ev.Descripcion ?? "");
        setImagen(ev.Foto);
        const d = new Date(ev.Fecha);
        if (!isNaN(d.getTime())) setDatePickerValue(d);
      })
      .catch(() => Alert.alert("Error", "No se pudo cargar el evento."))
      .finally(() => setCargando(false));
  }, [modoEdicion, evento_id, session?.access_token]);

  // ── DatePicker ────────────────────────────────────────────────────────────
  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (date && event.type !== "dismissed") {
      setDatePickerValue(date);
      setFecha(toISO(date));
    }
  };

  // ── Imagen ────────────────────────────────────────────────────────────────
  const handleSeleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  const handleTomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  const handleAgregarImagen = () => {
    Alert.alert("Agregar imagen", "¿Cómo deseas agregar la imagen?", [
      { text: "Galería", onPress: handleSeleccionarImagen },
      { text: "Cámara", onPress: handleTomarFoto },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  // ── Guardar ───────────────────────────────────────────────────────────────
  const handleGuardar = async () => {
    if (!titulo.trim()) {
      Alert.alert("Error", "El título del evento es obligatorio.");
      return;
    }
    if (!tipo) {
      Alert.alert("Error", "El tipo de evento es obligatorio.");
      return;
    }
    if (!session?.access_token) return;

    setGuardando(true);
    try {
      // Si la imagen ya viene de la URL del servidor, no reenviarla como archivo
      const imagenLocal =
        imagen && !imagen.startsWith("http") ? imagen : undefined;

      if (modoEdicion) {
        await actualizarEvento(
          Number(evento_id),
          {
            Titulo: titulo.trim(),
            Fecha: fecha,
            Tipo: tipo as TipoEvento,
            Descripcion: descripcion.trim() || null,
          },
          session.access_token,
          imagenLocal,
        );
      } else {
        await crearEvento(
          {
            Animal_id: Number(animal_id),
            Titulo: titulo.trim(),
            Fecha: fecha,
            Tipo: tipo as TipoEvento,
            Descripcion: descripcion.trim() || null,
          },
          session.access_token,
          imagenLocal,
        );
      }

      Alert.alert(
        "Éxito",
        modoEdicion
          ? "Evento actualizado correctamente."
          : "Evento registrado correctamente.",
      );
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo guardar el evento.");
    } finally {
      setGuardando(false);
    }
  };

  // ── Loading de edición ────────────────────────────────────────────────────
  if (cargando) {
    return (
      <>
        <ScreenHeader title="Editar Evento" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  const headerTitle = modoEdicion
    ? "Editar Evento"
    : animal_nombre
      ? `Nuevo Evento · ${animal_nombre}`
      : "Nuevo Evento";

  return (
    <>
      <ScreenHeader title={headerTitle} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Imagen opcional ────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleAgregarImagen}
        >
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={styles.imagePlaceholderIcon}>📷</ThemedText>
              <ThemedText style={styles.imagePlaceholderText}>
                Agregar foto del evento (opcional)
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

        {/* ── Detalles ───────────────────────────────────────────────────── */}
        <ThemedText style={styles.sectionTitle}>Detalles del Evento</ThemedText>

        <ThemedText style={styles.label}>Título *</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: Vacunación anual"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={titulo}
          onChangeText={setTitulo}
        />

        <ThemedText style={styles.label}>Tipo de Evento *</ThemedText>
        <Dropdown
          data={TIPO_OPCIONES}
          placeholder="Seleccione el tipo de evento"
          value={tipo ? (TIPO_OPCIONES.find((o) => o.value === tipo)?.id ?? "") : ""}
          onValueChange={(val) => {
            const encontrado = TIPO_OPCIONES.find((o) => o.id === Number(val));
            if (encontrado) setTipo(encontrado.value);
          }}
        />

        <ThemedText style={styles.label}>Fecha del Evento *</ThemedText>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <ThemedText style={fecha ? styles.dateText : styles.datePlaceholder}>
            {fecha ? formatDisplayDate(fecha) : "Seleccionar fecha"}
          </ThemedText>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={datePickerValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        <ThemedText style={styles.label}>Descripción</ThemedText>
        <TextInput
          style={styles.textArea}
          placeholder="Describe el evento (opcional)"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* ── Botones ────────────────────────────────────────────────────── */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={guardando}
          >
            <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BACKGROUND,
  },

  // Imagen
  imageContainer: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  imagePreview: {
    width: 240,
    height: 140,
    borderRadius: 12,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: 240,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.INPUT_BORDER,
    backgroundColor: Colors.CARD_DETAILS,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imagePlaceholderIcon: { fontSize: 28 },
  imagePlaceholderText: {
    fontSize: 12,
    color: Colors.PLACEHOLDER_GRAY,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  removeImageText: {
    color: "#EF4444",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 4,
  },

  // Formulario
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
    justifyContent: "center",
  },
  dateText: { fontSize: 15, color: Colors.TITLE },
  datePlaceholder: { fontSize: 15, color: Colors.PLACEHOLDER_GRAY },
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

  // Botones
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
});
