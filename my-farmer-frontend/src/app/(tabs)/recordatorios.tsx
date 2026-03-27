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
  Animated,
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

type Categoria = "Todos" | "Animales" | "Cultivos";

type Recordatorio = {
  id: string;
  titulo: string;
  fecha: string;
  categoria: "Animales" | "Cultivos";
  completado: boolean;
};

const recordatoriosIniciales: Recordatorio[] = [
  { id: "1", titulo: "Vacunar al ganado contra la fiebre aftosa.", fecha: "15 de Mayo de 2024", categoria: "Animales", completado: false },
  { id: "2", titulo: "Revisar riego en parcela de maíz.", fecha: "16 de Mayo de 2024", categoria: "Cultivos", completado: false },
  { id: "3", titulo: "Alimentar a los cerdos con pienso especial.", fecha: "17 de Mayo de 2024", categoria: "Animales", completado: true },
  { id: "4", titulo: "Aplicar fertilizante orgánico a la plantación de tomate.", fecha: "18 de Mayo de 2024", categoria: "Cultivos", completado: false },
  { id: "5", titulo: "Control de plagas en invernadero de pimientos.", fecha: "19 de Mayo de 2024", categoria: "Cultivos", completado: false },
];

export default function RecordatoriosScreen() {
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>("Todos");
  const [recordatorios, setRecordatorios] = useState(recordatoriosIniciales);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState<"Animales" | "Cultivos">("Animales");
  const [modalExpandido, setModalExpandido] = useState(false);
  const modalFadeAnim = useState(new Animated.Value(0))[0];

  const toggleModalExpandir = () => {
    if (modalExpandido) {
      Animated.timing(modalFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setModalExpandido(false));
    } else {
      setModalExpandido(true);
      Animated.timing(modalFadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const filtrados = categoriaActiva === "Todos"
    ? recordatorios
    : recordatorios.filter((r) => r.categoria === categoriaActiva);

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

  const agregar = () => {
    if (!nuevoTitulo.trim()) {
      Alert.alert("Error", "El título no puede estar vacío.");
      return;
    }
    const nuevo: Recordatorio = {
      id: Date.now().toString(),
      titulo: nuevoTitulo.trim(),
      fecha: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }),
      categoria: nuevaCategoria,
      completado: false,
    };
    setRecordatorios((prev) => [nuevo, ...prev]);
    setNuevoTitulo("");
    setNuevaCategoria("Animales");
    setModalVisible(false);
  };

  const categorias: Categoria[] = ["Todos", "Animales", "Cultivos"];

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
          {categorias.map((cat) => (
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
                    <Text style={styles.cardFecha}>{item.fecha}</Text>
                  </View>

                  <View style={[styles.badge, item.categoria === "Animales" ? styles.badgeAnimal : styles.badgeCultivo]}>
                    <Text style={[styles.badgeText, item.categoria === "Animales" ? styles.badgeTextAnimal : styles.badgeTextCultivo]}>
                      {item.categoria === "Animales" ? "Animal" : "Cultivo"}
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
                
                <Text style={styles.modalLabel}>Categoría</Text>
                <TouchableOpacity 
                  style={styles.modalCategoriaSelector} 
                  onPress={toggleModalExpandir}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCategoriaSelectorText}>{nuevaCategoria}</Text>
                  <Text style={[styles.arrow, modalExpandido && styles.arrowRotated]}>▼</Text>
                </TouchableOpacity>

                {modalExpandido && (
                  <Animated.View style={[styles.modalTabsDropdown, { opacity: modalFadeAnim }]}>
                    {(["Animales", "Cultivos"] as const).map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.modalTabDropdownItem, nuevaCategoria === cat && styles.modalTabActivo]}
                        onPress={() => {
                          setNuevaCategoria(cat);
                          toggleModalExpandir();
                        }}
                      >
                        <Text style={[styles.modalTabText, nuevaCategoria === cat && styles.modalTabTextActivo]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                )}

                <TextInput
                  style={styles.modalInput}
                  placeholder="Título del recordatorio"
                  placeholderTextColor={Colors.PLACEHOLDER_GRAY}
                  value={nuevoTitulo}
                  onChangeText={setNuevoTitulo}
                  multiline
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
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
  arrow: { fontSize: 12, color: Colors.SUBTITLE, transitionDuration: "0.2s" },
  arrowRotated: { transform: [{ rotate: "180deg" }] },
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
  modalContainer: { backgroundColor: Colors.CARD_DETAILS, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.TITLE, marginBottom: 4 },
  modalInput: { backgroundColor: Colors.BACKGROUND, borderWidth: 1, borderColor: Colors.INPUT_BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: Colors.TITLE, minHeight: 80, textAlignVertical: "top" },
  modalLabel: { fontSize: 14, fontWeight: "500", color: Colors.TITLE },
  modalCategoriaSelector: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: Colors.BACKGROUND, 
    borderWidth: 1, 
    borderColor: Colors.INPUT_BORDER, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12 
  },
  modalCategoriaSelectorText: { fontSize: 15, color: Colors.TITLE },
  modalTabsDropdown: { 
    backgroundColor: Colors.BACKGROUND, 
    borderWidth: 1, 
    borderColor: Colors.INPUT_BORDER, 
    borderRadius: 12, 
    marginTop: -8, 
    overflow: "hidden" 
  },
  modalTabDropdownItem: { 
    paddingVertical: 12, 
    alignItems: "center", 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.INPUT_BORDER 
  },
  modalTab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10, borderWidth: 1, borderColor: Colors.INPUT_BORDER, backgroundColor: Colors.BACKGROUND },
  modalTabActivo: { backgroundColor: Colors.PRIMARY_GREEN, borderColor: Colors.PRIMARY_GREEN },
  modalTabText: { fontSize: 14, color: Colors.SUBTITLE, fontWeight: "500" },
  modalTabTextActivo: { color: "#fff", fontWeight: "600" },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: Colors.INPUT_BORDER, alignItems: "center", justifyContent: "center", backgroundColor: Colors.CARD_DETAILS },
  cancelText: { fontSize: 16, color: Colors.TITLE, fontWeight: "500" },
  saveButton: { flex: 1, height: 50, borderRadius: 12, backgroundColor: Colors.PRIMARY_GREEN, alignItems: "center", justifyContent: "center" },
  saveText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});