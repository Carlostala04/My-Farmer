/**
 * Formulario de Registro/Edición de Animal (registerAnimal.tsx)
 *
 * Permite al usuario crear un nuevo animal o editar uno existente.
 * - En modo creación: no recibe parámetros, guarda con crearAnimal.
 * - En modo edición: recibe `animal_id` como parámetro de navegación,
 *   carga los datos del animal y pre-rellena el formulario. Al guardar
 *   llama a actualizarAnimal con los campos modificados.
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
  Modal,
  Text,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import { ThemedText } from "@/components/themed-text";
import ScreenHeader from "@/components/header";
import Dropdown from "@/components/dropdown";
import { SexoAnimal, ResponseAnimalDto } from "@/ts/animalsProps";
import { useAnimales } from "@/hooks/useAnimales";
import { useCategorias } from "@/hooks/useCategorias";
import { useParcelas } from "@/hooks/useParcelas";
import { useAuth } from "@/supabase/useAuth";
import { getAnimalById, actualizarAnimal } from "@/services/animalesService";

export default function RegisterAnimalScreen() {
  const router = useRouter();
  const { session } = useAuth();

  // Recibe animal_id cuando viene desde la pantalla de detalles (modo edición)
  const { animal_id } = useLocalSearchParams<{ animal_id?: string }>();
  const modoEdicion = !!animal_id;

  // Hook para crear animales en el backend
  const { crearAnimal, loading: loadingCrear } = useAnimales();

  // Estado de carga para modo edición
  const [guardando, setGuardando] = useState(false);
  const [cargandoAnimal, setCargandoAnimal] = useState(false);

  // Opciones dinámicas desde el backend
  const { categorias } = useCategorias();
  const { parcelas } = useParcelas();

  const sexoOpciones = [
    { id: 1, nombre: "Macho", value: "macho" as SexoAnimal },
    { id: 2, nombre: "Hembra", value: "hembra" as SexoAnimal },
  ];
  const pesosOpciones = [
    { id: 1, nombre: "Kg" },
    { id: 2, nombre: "Lb" },
  ];
  const estadoOpciones = [
    { id: 1, nombre: "Saludable" },
    { id: 2, nombre: "Enfermo" },
    { id: 3, nombre: "En tratamiento" },
    { id: 4, nombre: "En cuarentena" },
    { id: 5, nombre: "Muerto" },
  ];

  // Opciones de categorías mapeadas para el componente Dropdown
  const categoriasOpciones = categorias.map((c) => ({
    id: c.Categoria_Animal_id,
    nombre: c.Nombre,
  }));

  // Opciones de parcelas mapeadas para el componente Dropdown
  const parcelasOpciones = parcelas.map((p) => ({
    id: p.Parcela_id,
    nombre: p.Nombre,
  }));

  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("");
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

  // DatePicker para fecha de nacimiento
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (date && event.type !== "dismissed") {
      setDatePickerValue(date);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      setFechaNacimiento(`${y}-${m}-${d}`);
    }
  };

  // Datos del animal cargado para edición
  const [animalEditData, setAnimalEditData] = useState<ResponseAnimalDto | null>(null);

  // En modo edición: cargar datos del animal desde el backend
  useEffect(() => {
    if (!modoEdicion || !session?.access_token || !animal_id) return;
    setCargandoAnimal(true);
    getAnimalById(Number(animal_id), session.access_token)
      .then(setAnimalEditData)
      .catch(() => Alert.alert("Error", "No se pudo cargar el animal."))
      .finally(() => setCargandoAnimal(false));
  }, [modoEdicion, animal_id, session?.access_token]);

  // Pre-rellenar el formulario cuando los datos del animal Y las listas estén listas
  useEffect(() => {
    if (!animalEditData || categorias.length === 0) return;

    setNombre(animalEditData.Nombre);
    setSexo((animalEditData.Sexo as SexoAnimal) ?? "");
    setEstado(animalEditData.Estado_Label ?? "");
    setRaza(animalEditData.Raza ?? "");
    setColor(animalEditData.Color ?? "");
    const fechaNac = animalEditData.Fecha_Nacimiento ?? "";
    setFechaNacimiento(fechaNac);
    if (fechaNac) {
      const parsed = new Date(fechaNac);
      if (!isNaN(parsed.getTime())) setDatePickerValue(parsed);
    }
    setPeso(animalEditData.Peso != null ? String(animalEditData.Peso) : "");
    setPesoUnidad(animalEditData.Peso_Unidad ?? "");
    setAltura(animalEditData.Altura != null ? String(animalEditData.Altura) : "");
    setObservaciones(animalEditData.Notas ?? "");
    setImagen(animalEditData.Foto ?? null);

    // Mapear nombre de categoría → ID
    const cat = categorias.find((c) => c.Nombre === animalEditData.Categoria);
    if (cat) setCategoriaAnimal(cat.Categoria_Animal_id);

    // Mapear nombre de parcela → ID
    const parc = parcelas.find((p) => p.Nombre === animalEditData.Parcela);
    if (parc) setParcela(parc.Parcela_id);
  }, [animalEditData, categorias, parcelas]);

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
   * Valida los campos obligatorios y guarda el animal (crea o actualiza).
   */
  const handleGuardar = async () => {
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

    if (modoEdicion) {
      // Modo edición: llamar al servicio directamente
      if (!session?.access_token) return;
      setGuardando(true);
      try {
        await actualizarAnimal(
          Number(animal_id),
          {
            Nombre: nombre.trim(),
            Sexo: sexo as SexoAnimal,
            Categoria_Animal_id: categoriaAnimal,
            Raza: raza.trim() || null,
            Color: color.trim() || null,
            Fecha_Nacimiento: fechaNacimiento.trim() || null,
            Peso: peso ? parseFloat(peso) : null,
            Peso_Unidad: pesoUnidad || null,
            Altura: altura ? parseFloat(altura) : null,
            Estado_Label: estado || null,
            Notas: observaciones.trim() || null,
            Parcela_id: parcela || null,
          },
          session.access_token,
        );
        Alert.alert("Éxito", "Animal actualizado correctamente.");
        router.back();
      } catch (e: any) {
        Alert.alert("Error", e.message ?? "No se pudo actualizar el animal.");
      } finally {
        setGuardando(false);
      }
    } else {
      // Modo creación
      const ok = await crearAnimal(
        {
          Nombre: nombre.trim(),
          Sexo: sexo as SexoAnimal,
          Categoria_Animal_id: categoriaAnimal,
          Raza: raza.trim() || null,
          Color: color.trim() || null,
          Fecha_Nacimiento: fechaNacimiento.trim() || null,
          Peso: peso ? parseFloat(peso) : null,
          Peso_Unidad: pesoUnidad || null,
          Altura: altura ? parseFloat(altura) : null,
          Estado_Label: estado || null,
          Notas: observaciones.trim() || null,
          Parcela_id: parcela || null,
        },
        imagen ?? undefined,
      );

      if (ok) {
        Alert.alert("Éxito", "Animal registrado correctamente.");
        router.back();
      } else {
        Alert.alert("Error", "No se pudo registrar el animal. Intenta de nuevo.");
      }
    }
  };

  const loading = modoEdicion ? guardando : loadingCrear;

  if (cargandoAnimal) {
    return (
      <>
        <ScreenHeader title="Editar Animal" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title={modoEdicion ? "Editar Animal" : "Registrar Animal"} />
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
          value={sexoOpciones.find((o) => o.value === sexo)?.id ?? ""}
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

        {/* Categoría cargada dinámicamente desde el backend */}
        <ThemedText style={styles.label}>Categoria animal</ThemedText>
        <Dropdown
          data={categoriasOpciones}
          placeholder="Seleccione una categoria para el animal"
          value={categoriaAnimal || ""}
          onValueChange={(val) => setCategoriaAnimal(Number(val))}
        />

        <ThemedText style={styles.label}>Estado</ThemedText>
        <Dropdown
          data={estadoOpciones}
          placeholder="Seleccione el estado del animal"
          value={estadoOpciones.find((o) => o.nombre === estado)?.id ?? ""}
          onValueChange={(val) => {
            const encontrado = estadoOpciones.find((o) => o.id === Number(val));
            if (encontrado) setEstado(encontrado.nombre);
          }}
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
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText
                style={fechaNacimiento ? styles.dateText : styles.datePlaceholder}
              >
                {fechaNacimiento || "YYYY-MM-DD"}
              </ThemedText>
            </TouchableOpacity>
            {/* Android: el picker se muestra como diálogo nativo */}
            {showDatePicker && Platform.OS === "android" && (
              <DateTimePicker
                value={datePickerValue}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* iOS: modal con fondo blanco explícito para que el spinner sea visible */}
            {Platform.OS === "ios" && (
              <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.iosModalOverlay}>
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.iosPickerDone}>Listo</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={datePickerValue}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      textColor="#000000"
                      style={styles.iosPicker}
                    />
                  </View>
                </View>
              </Modal>
            )}
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
          value={pesosOpciones.find((o) => o.nombre === pesoUnidad)?.id ?? ""}
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

        {/* Parcela cargada dinámicamente desde el backend */}
        <ThemedText style={styles.label}>Parcela</ThemedText>
        <Dropdown
          data={parcelasOpciones}
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
