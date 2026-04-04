/**
 * Formulario de Registro de Cultivo (registerCultivos.tsx)
 *
 * Permite al usuario crear un nuevo cultivo en el backend.
 *
 * Cambios respecto a la versión anterior:
 *  - Se conectó el botón "Guardar" al backend usando el hook `useCultivos`.
 *  - El dropdown de "Tipo de Cultivo" se pobla dinámicamente desde el backend
 *    mediante el hook `useTiposCultivo` (antes estaba vacío con `data={[]}`).
 *  - El dropdown de "Ubicación / Parcela" se pobla dinámicamente desde el backend
 *    mediante el hook `useParcelas` (antes estaba vacío con `data={[]}`).
 *  - Se agregó un indicador de carga en el botón "Guardar" mientras se envía la petición.
 *  - Se manejan los errores del backend mostrando un Alert con el mensaje del servidor.
 *  - La imagen seleccionada se adjunta al request como archivo multipart.
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";
import Dropdown from "@/components/dropdown";
import { EstadoCultivo } from "@/ts/cultivoProps";
import { useCultivos } from "@/hooks/useCultivos";
import { useTiposCultivo } from "@/hooks/useTiposCultivo";
import { useParcelas } from "@/hooks/useParcelas";

export default function RegisterCultivosScreen() {
  const router = useRouter();

  // Hook para crear cultivos en el backend
  const { crearCultivo, loading } = useCultivos();

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
   * Valida los campos obligatorios y envía el cultivo al backend.
   * Si la petición falla, muestra el mensaje de error del servidor.
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
  };

  return (
    <>
      <ScreenHeader title="Registrar Cultivo" />
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
            <TextInput
              style={styles.input}
              placeholder="Ej: 2024-03-15"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={fechaSiembra}
              onChangeText={setFechaSiembra}
            />
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
            <ThemedText style={styles.label}>Fecha cosecha estimada</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2024-06-15"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={fechaCosechaEstimada}
              onChangeText={setFechaCosechaEstimada}
            />
          </View>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Fecha de cosecha</ThemedText>
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              placeholder="Sin registrar"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              editable={false}
            />
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
              <ThemedText style={styles.saveText}>Guardar</ThemedText>
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
});
