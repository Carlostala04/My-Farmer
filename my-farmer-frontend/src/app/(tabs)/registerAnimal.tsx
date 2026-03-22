import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";

export default function RegisterAnimalScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [edad, setEdad] = useState("");
  const [color, setColor] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleGuardar = () => {
    if (!nombre.trim() || !tipo.trim()) {
      Alert.alert("Error", "El nombre y tipo de animal son obligatorios.");
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
        {/* Datos Básicos */}
        <ThemedText style={styles.sectionTitle}>Datos Básicos</ThemedText>

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

        <ThemedText style={styles.label}>Tipo de Animal</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: Vaca, Cerdo, Gallina"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          value={tipo}
          onChangeText={setTipo}
        />
        <ThemedText style={styles.hint}>
          Especifica la especie o raza del animal.
        </ThemedText>

        {/* Características Físicas */}
        <ThemedText style={styles.sectionTitle}>
          Características Físicas
        </ThemedText>

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <ThemedText style={styles.label}>Edad</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Ej: 2 años"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={edad}
              onChangeText={setEdad}
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

        <ThemedText style={styles.label}>Peso (kg)</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Ej: 500"
          placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <ThemedText style={styles.hint}>
          Peso actual del animal en kilogramos.
        </ThemedText>

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
});