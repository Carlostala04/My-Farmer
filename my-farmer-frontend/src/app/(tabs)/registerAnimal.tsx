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
import Dropdown from "@/components/dropdown";
import { SexoAnimal } from "@/ts/animalsProps";

export default function RegisterAnimalScreen() {
  const router = useRouter();

  const sexoOpciones = [
    { id: 1, nombre: "Macho", value: "macho" as SexoAnimal },
    { id: 2, nombre: "Hembra", value: "hembra" as SexoAnimal },
  ];
  const pesosOpciones = [
    { id: 1, nombre: "Kg" },
    { id: 2, nombre: "Lb" },
  ];

  const [nombre, setNombre] = useState("");
  const [sexo, setSexo] = useState<SexoAnimal | "">("");
  const [categoriaAnimal, setCategoriaAnimal] = useState<number>(0);
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [peso, setPeso] = useState("");
  const [pesoUnidad, setPesoUnidad] = useState("");
  const [altura, setAltura] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [parcela, setParcela] = useState<number>(0);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const handleGuardar = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del animal es obligatorio.");
      return;
    }
    if (!sexo) {
      Alert.alert("Error", "El sexo del animal es obligatorio.");
      return;
    }
    if (!categoriaAnimal) {
      Alert.alert("Error", "La categoría del animal es obligatoria.");
      return;
    }
    // Aquí después conectas con tu backend
    Alert.alert("Éxito", "Animal registrado correctamente.");
    router.back();
  };

  return (
    <>
      <ScreenHeader title="Registrar Animal" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen del Animal */}
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
                Agregar foto del animal
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
        <ThemedText style={styles.label}>Sexo</ThemedText>
        <Dropdown
          data={sexoOpciones}
          placeholder="Ingrese el sexo del animal"
          value={sexo}
          onValueChange={(val) => {
            const encontrado = sexoOpciones.find((o) => o.id === Number(val));
            if (encontrado) setSexo(encontrado.value);
          }}
        />
        <ThemedText style={styles.label}>Nombre del Animal</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: Manchas"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={nombre}
          onChangeText={setNombre}
        />
        <ThemedText style={styles.hint}>
          Nombre único para identificar al animal dentro de tu rebaño o grupo.
        </ThemedText>

        <ThemedText style={styles.label}>Categoria animal</ThemedText>
        <Dropdown
          data={[]}
          placeholder="Seleccione una categoria para el animal"
          value={categoriaAnimal || ""}
          onValueChange={(val) => setCategoriaAnimal(Number(val))}
        />
        <ThemedText style={styles.label}>Raza</ThemedText>
        <TextInput
          placeholder="Ingrese la raza del animal"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={raza}
          onChangeText={setRaza}
          style={styles.input}
        />
        {/* Características Físicas */}
        <ThemedText style={styles.sectionTitle}>
          Características Físicas
        </ThemedText>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Fecha de nacimiento</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={fechaNacimiento}
              onChangeText={setFechaNacimiento}
            />
          </View>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Color</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Ej: Blanco, Marrón"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={color}
              onChangeText={setColor}
            />
          </View>
        </View>

        <ThemedText style={styles.label}>Unidad de peso</ThemedText>
        <Dropdown
          data={pesosOpciones}
          placeholder="Ingrese la unidad de peso"
          value={pesoUnidad}
          onValueChange={(val) => {
            const encontrado = pesosOpciones.find((o) => o.id === Number(val));
            if (encontrado) setPesoUnidad(encontrado.nombre);
          }}
        />
        <ThemedText style={styles.hint}>Ingrese el peso del animal</ThemedText>
        <TextInput
          placeholder="Ingrese el peso del animal"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={peso}
          onChangeText={setPeso}
          keyboardType="numeric"
          style={styles.input}
        />
        <ThemedText style={styles.label}>Altura (cm)</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: 150"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
        <ThemedText style={styles.hint}>
          Altura desde el suelo hasta el lomo del animal.
        </ThemedText>
        <ThemedText style={styles.label}>Parcela</ThemedText>
        <Dropdown
          data={[]}
          placeholder="Seleccione una parcela"
          value={parcela || ""}
          onValueChange={(val) => setParcela(Number(val))}
        />

        {/* Notas Adicionales */}
        <ThemedText style={styles.sectionTitle}>Notas Adicionales</ThemedText>

        <ThemedText style={styles.label}>Observaciones</ThemedText>
        <TextInput
          style={styles.textArea}
          placeholder="Cualquier información relevante sobre el animal, historial médico, comportamiento, etc."
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
