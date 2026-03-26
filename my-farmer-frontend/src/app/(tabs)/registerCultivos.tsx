import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";

export default function RegisterCultivosScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [fechaSiembra, setFechaSiembra] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [area, setArea] = useState("");
  const [estado, setEstado] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);

  const handleSeleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita acceso a la galería para seleccionar una imagen.");
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
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara para tomar una foto.");
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

  const handleGuardar = () => {
    if (!nombre.trim() || !tipo.trim()) {
      Alert.alert("Error", "El nombre y tipo de cultivo son obligatorios.");
      return;
    }
    // Aquí después conectas con tu backend
    Alert.alert("Éxito", "Cultivo registrado correctamente.");
    router.back();
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
        <TouchableOpacity style={styles.imageContainer} onPress={handleAgregarImagen}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={styles.imagePlaceholderIcon}>🌱</ThemedText>
              <ThemedText style={styles.imagePlaceholderText}>Agregar foto del cultivo</ThemedText>
            </View>
          )}
        </TouchableOpacity>
        {imagen && (
          <TouchableOpacity onPress={() => setImagen(null)}>
            <ThemedText style={styles.removeImageText}>Eliminar imagen</ThemedText>
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

        <ThemedText style={styles.label}>Tipo de Cultivo</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: Maíz, Frijol, Tomate"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={tipo}
          onChangeText={setTipo}
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
            <TextInput
              style={styles.input}
              placeholder="Ej: En crecimiento"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={estado}
              onChangeText={setEstado}
            />
          </View>
        </View>

        <ThemedText style={styles.label}>Ubicación / Parcela</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: Parcela A, Lote 3"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={ubicacion}
          onChangeText={setUbicacion}
        />
        <ThemedText style={styles.hint}>
          Indica en qué zona o parcela de la finca se encuentra el cultivo.
        </ThemedText>

        <ThemedText style={styles.label}>Área (hectáreas)</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: 2.5"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          keyboardType="numeric"
          value={area}
          onChangeText={setArea}
        />
        <ThemedText style={styles.hint}>
          Superficie total sembrada en hectáreas.
        </ThemedText>

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
          >
            <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <ThemedText style={styles.saveText}>Guardar</ThemedText>
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
