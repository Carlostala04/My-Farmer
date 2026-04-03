import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import NavBar from "@/components/navBar";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import Colors from "@/constants/colors";
import Dropdown from "@/components/dropdown";
import { EntidadTipo } from "@/ts/recordatorioProps";

type CategoriaFiltro = "Todos" | "Animales" | "Cultivos";

type Recordatorio = {
  id: string;
  titulo: string;
  fecha: string;
  entidad_tipo: EntidadTipo;
  entidad_id: number;
  descripcion: string | null;
  recordar: string;
  completado: boolean;
};

const recordatoriosIniciales: Recordatorio[] = [
  { id: "1", titulo: "Vacunar al ganado contra la fiebre aftosa.", fecha: "15 de Mayo de 2024", entidad_tipo: "animal", entidad_id: 1, descripcion: null, recordar: "2024-05-15 08:00", completado: false },
  { id: "2", titulo: "Revisar riego en parcela de maíz.", fecha: "16 de Mayo de 2024", entidad_tipo: "cultivo", entidad_id: 1, descripcion: null, recordar: "2024-05-16 09:00", completado: false },
  { id: "3", titulo: "Alimentar a los cerdos con pienso especial.", fecha: "17 de Mayo de 2024", entidad_tipo: "animal", entidad_id: 2, descripcion: null, recordar: "2024-05-17 07:00", completado: true },
  { id: "4", titulo: "Aplicar fertilizante orgánico a la plantación de tomate.", fecha: "18 de Mayo de 2024", entidad_tipo: "cultivo", entidad_id: 2, descripcion: null, recordar: "2024-05-18 10:00", completado: false },
  { id: "5", titulo: "Control de plagas en invernadero de pimientos.", fecha: "19 de Mayo de 2024", entidad_tipo: "cultivo", entidad_id: 3, descripcion: null, recordar: "2024-05-19 08:30", completado: false },
];

// Mock data — reemplazar con datos del backend
const animalesMock = [
  { id: 1, nombre: "Lola" },
  { id: 2, nombre: "Juan" },
  { id: 3, nombre: "Pepe" },
  { id: 4, nombre: "RedBull" },
];

const cultivosMock = [
  { id: 1, nombre: "Maíz del norte" },
  { id: 2, nombre: "Tomate invernadero" },
  { id: 3, nombre: "Pimientos" },
];

const entidadTipoOpciones = [
  { id: 1, nombre: "Animal", value: "animal" as EntidadTipo },
  { id: 2, nombre: "Cultivo", value: "cultivo" as EntidadTipo },
];

export default function RecordatoriosScreen() {
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaFiltro>("Todos");
  const [recordatorios, setRecordatorios] = useState(recordatoriosIniciales);
  const [modalVisible, setModalVisible] = useState(false);

  // Estados del formulario del modal
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaEntidadTipo, setNuevaEntidadTipo] = useState<EntidadTipo | "">("");
  const [nuevaEntidadId, setNuevaEntidadId] = useState<number>(0);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevoRecordar, setNuevoRecordar] = useState("");

  const filtrados =
    categoriaActiva === "Todos"
      ? recordatorios
      : recordatorios.filter((r) =>
          r.entidad_tipo === (categoriaActiva === "Animales" ? "animal" : "cultivo")
        );

  const toggleCompletado = (id: string) => {
    setRecordatorios((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completado: !r.completado } : r))
    );
  };

  const eliminar = (id: string) => {
    setRecordatorios((prev) => prev.filter((r) => r.id !== id));
  };

  const confirmarEliminar = (id: string) => {
    Alert.alert(
      "Eliminar Recordatorio",
      "¿Estás seguro de que quieres eliminar este recordatorio?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => eliminar(id) },
      ]
    );
  };

  const resetModal = () => {
    setNuevoTitulo("");
    setNuevaEntidadTipo("");
    setNuevaEntidadId(0);
    setNuevaDescripcion("");
    setNuevoRecordar("");
  };

  const agregar = () => {
    if (!nuevoTitulo.trim()) {
      Alert.alert("Error", "El título no puede estar vacío.");
      return;
    }
    if (!nuevaEntidadTipo) {
      Alert.alert("Error", "Debes seleccionar una categoría.");
      return;
    }
    if (!nuevaEntidadId) {
      Alert.alert("Error", "Debes seleccionar un animal o cultivo relacionado.");
      return;
    }
    if (!nuevoRecordar.trim()) {
      Alert.alert("Error", "El campo 'Recordar el' no puede estar vacío.");
      return;
    }
    const nuevo: Recordatorio = {
      id: Date.now().toString(),
      titulo: nuevoTitulo.trim(),
      fecha: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
      entidad_tipo: nuevaEntidadTipo as EntidadTipo,
      entidad_id: nuevaEntidadId,
      descripcion: nuevaDescripcion.trim() || null,
      recordar: nuevoRecordar.trim(),
      completado: false,
    };
    setRecordatorios((prev) => [nuevo, ...prev]);
    resetModal();
    setModalVisible(false);
  };

  const categoriasFiltro: CategoriaFiltro[] = ["Todos", "Animales", "Cultivos"];

  const entidadData = nuevaEntidadTipo === "animal" ? animalesMock : nuevaEntidadTipo === "cultivo" ? cultivosMock : [];

  const renderDeleteAction = (id: string) => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => eliminar(id)}>
      <Text style={styles.deleteActionText}>🗑</Text>
      <Text style={styles.deleteActionLabel}>Eliminar</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenHeader
        title="Recordatorios"
        actions={[
          { icon: <FilterIcon width={22} height={22} />, onPress: () => console.log("filtrar") },
          {
            icon: <Text style={{ fontSize: 28, color: Colors.PRIMARY_GREEN, fontWeight: "300" }}>+</Text>,
            onPress: () => setModalVisible(true),
          },
        ]}
      />
      <NavBar />
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          {categoriasFiltro.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, categoriaActiva === cat && styles.tabActivo]}
              onPress={() => setCategoriaActiva(cat)}
            >
              <Text style={[styles.tabText, categoriaActiva === cat && styles.tabTextActivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista */}
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderDeleteAction(item.id)}
              overshootRight={false}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onLongPress={() => confirmarEliminar(item.id)}
                delayLongPress={500}
              >
                <View style={styles.card}>
                  <TouchableOpacity
                    style={[styles.checkbox, item.completado && styles.checkboxActivo]}
                    onPress={() => toggleCompletado(item.id)}
                  >
                    {item.completado && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>

                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitulo, item.completado && styles.cardTituloTachado]}>
                      {item.titulo}
                    </Text>
                    <Text style={styles.cardFecha}>{item.recordar}</Text>
                  </View>

                  <View style={[styles.badge, item.entidad_tipo === "animal" ? styles.badgeAnimal : styles.badgeCultivo]}>
                    <Text style={[styles.badgeText, item.entidad_tipo === "animal" ? styles.badgeTextAnimal : styles.badgeTextCultivo]}>
                      {item.entidad_tipo === "animal" ? "Animal" : "Cultivo"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>

      {/* Modal agregar */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Nuevo Recordatorio</Text>

                <Text style={styles.modalLabel}>Título</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Título del recordatorio"
                  placeholderTextColor={Colors.PLACEHOLDER_GRAY}
                  value={nuevoTitulo}
                  onChangeText={setNuevoTitulo}
                />

                <Text style={styles.modalLabel}>Categoría</Text>
                <Dropdown
                  data={entidadTipoOpciones}
                  placeholder="Seleccione una categoría"
                  value={nuevaEntidadTipo}
                  onValueChange={(val) => {
                    const encontrado = entidadTipoOpciones.find((o) => o.id === Number(val));
                    if (encontrado) {
                      setNuevaEntidadTipo(encontrado.value);
                      setNuevaEntidadId(0);
                    }
                  }}
                />

                {nuevaEntidadTipo !== "" && (
                  <>
                    <Text style={styles.modalLabel}>
                      {nuevaEntidadTipo === "animal" ? "Animal relacionado" : "Cultivo relacionado"}
                    </Text>
                    <Dropdown
                      data={entidadData}
                      placeholder={nuevaEntidadTipo === "animal" ? "Seleccione un animal" : "Seleccione un cultivo"}
                      value={nuevaEntidadId || ""}
                      onValueChange={(val) => setNuevaEntidadId(Number(val))}
                    />
                  </>
                )}

                <Text style={styles.modalLabel}>Descripción</Text>
                <TextInput
                  style={styles.modalTextArea}
                  placeholder="Descripción del recordatorio (opcional)"
                  placeholderTextColor={Colors.PLACEHOLDER_GRAY}
                  value={nuevaDescripcion}
                  onChangeText={setNuevaDescripcion}
                  multiline
                  numberOfLines={3}
                />

                <Text style={styles.modalLabel}>Recordar el</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="YYYY-MM-DD HH:MM"
                  placeholderTextColor={Colors.PLACEHOLDER_GRAY}
                  value={nuevoRecordar}
                  onChangeText={setNuevoRecordar}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      resetModal();
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={agregar}>
                    <Text style={styles.saveText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.BACKGROUND, paddingHorizontal: 16, paddingTop: 16 },
  tabs: { flexDirection: "row", backgroundColor: Colors.CARD_DETAILS, borderRadius: 12, padding: 4, marginBottom: 16, borderWidth: 1, borderColor: Colors.INPUT_BORDER },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActivo: { backgroundColor: Colors.PRIMARY_GREEN },
  tabText: { fontSize: 14, color: Colors.SUBTITLE, fontWeight: "500" },
  tabTextActivo: { color: "#fff", fontWeight: "600" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.CARD_DETAILS, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.INPUT_BORDER, gap: 12 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.INPUT_BORDER, alignItems: "center", justifyContent: "center" },
  checkboxActivo: { backgroundColor: Colors.PRIMARY_GREEN, borderColor: Colors.PRIMARY_GREEN },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "700" },
  cardContent: { flex: 1, gap: 4 },
  cardTitulo: { fontSize: 14, color: Colors.TITLE, fontWeight: "500" },
  cardTituloTachado: { textDecorationLine: "line-through", color: Colors.PLACEHOLDER_GRAY },
  cardFecha: { fontSize: 12, color: Colors.PLACEHOLDER_GRAY },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeAnimal: { backgroundColor: "#F3F4F6" },
  badgeCultivo: { backgroundColor: "#DCFCE7" },
  badgeText: { fontSize: 12, fontWeight: "500" },
  badgeTextAnimal: { color: Colors.SUBTITLE },
  badgeTextCultivo: { color: Colors.PRIMARY_GREEN },
  deleteAction: { backgroundColor: "#EF4444", justifyContent: "center", alignItems: "center", width: 80, borderRadius: 12, marginBottom: 10 },
  deleteActionText: { fontSize: 20 },
  deleteActionLabel: { fontSize: 12, color: "#fff", fontWeight: "600", marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContainer: { backgroundColor: Colors.CARD_DETAILS, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.TITLE, marginBottom: 4 },
  modalLabel: { fontSize: 14, fontWeight: "500", color: Colors.TITLE, marginTop: 4 },
  modalInput: { backgroundColor: Colors.BACKGROUND, borderWidth: 1, borderColor: Colors.INPUT_BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.TITLE },
  modalTextArea: { backgroundColor: Colors.BACKGROUND, borderWidth: 1, borderColor: Colors.INPUT_BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.TITLE, minHeight: 80, textAlignVertical: "top" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 12 },
  cancelButton: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: Colors.INPUT_BORDER, alignItems: "center", justifyContent: "center", backgroundColor: Colors.CARD_DETAILS },
  cancelText: { fontSize: 16, color: Colors.TITLE, fontWeight: "500" },
  saveButton: { flex: 1, height: 50, borderRadius: 12, backgroundColor: Colors.PRIMARY_GREEN, alignItems: "center", justifyContent: "center" },
  saveText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
