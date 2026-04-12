/**
 * Pantalla de Recordatorios (recordatorios.tsx)
 *
 * Cambios respecto a la versión anterior:
 *  - Se eliminaron los datos hardcodeados (`recordatoriosIniciales`, `animalesMock`, `cultivosMock`).
 *  - Se integró `useRecordatorios` para cargar los recordatorios reales del usuario desde el backend.
 *  - El formulario de creación ahora envía el recordatorio al backend en lugar de solo al estado local.
 *  - Los dropdowns de "Animal relacionado" y "Cultivo relacionado" se pueblan con datos reales
 *    del backend mediante los hooks `useAnimales` y `useCultivos`.
 *  - La acción de eliminar (swipe y long press) ahora llama al backend.
 *  - Se agregó un indicador de carga y mensajes de error.
 *  - El "toggle completado" se mantiene solo local ya que el backend no tiene endpoint de toggle;
 *    se usa PATCH con `Cancelado: true` como equivalente a completado.
 */

import React, { useState, useMemo } from "react";
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
  ActivityIndicator,
  ScrollView,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import NavBar from "@/components/navBar";
import ScreenHeader from "@/components/header";
import FilterIcon from "@/components/ui/filterIcon";
import Colors from "@/constants/colors";
import Dropdown from "@/components/dropdown";
import { EntidadTipo } from "@/ts/recordatorioProps";
import { useTheme } from "@/contexts/ThemeContext";
import { useRecordatorios } from "@/hooks/useRecordatorios";
import { useAnimales } from "@/hooks/useAnimales";
import { useCultivos } from "@/hooks/useCultivos";

type CategoriaFiltro = "Todos" | "Animales" | "Cultivos";

const entidadTipoOpciones = [
  { id: 1, nombre: "Animal", value: "animal" as EntidadTipo },
  { id: 2, nombre: "Cultivo", value: "cultivo" as EntidadTipo },
];

export default function RecordatoriosScreen() {
  const { t } = useTheme();
  const [categoriaActiva, setCategoriaActiva] =
    useState<CategoriaFiltro>("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [ordenDescendente, setOrdenDescendente] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Datos reales del backend
  const {
    recordatorios,
    loading,
    error,
    crearRecordatorio,
    eliminarRecordatorio,
    toggleRecordatorio,
  } = useRecordatorios();
  const { animales } = useAnimales();
  const { cultivos } = useCultivos();

  // Estados del formulario del modal
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaEntidadTipo, setNuevaEntidadTipo] = useState<EntidadTipo | "">(
    "",
  );
  const [nuevaEntidadTipoId, setNuevaEntidadTipoId] = useState<number | "">("");
  const [nuevaEntidadId, setNuevaEntidadId] = useState<number>(0);
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevoRecordar, setNuevoRecordar] = useState("");
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);
  const [recordarFechaValue, setRecordarFechaValue] = useState(new Date());
  const [recordarHoraValue, setRecordarHoraValue] = useState(new Date());
  const [guardando, setGuardando] = useState(false);

  const buildRecordarString = (fecha: Date, hora: Date) => {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    const hh = String(hora.getHours()).padStart(2, "0");
    const mm = String(hora.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${hh}:${mm}`;
  };

  const handleFechaChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowFechaPicker(false);
    if (date && event.type !== "dismissed") {
      setRecordarFechaValue(date);
      setNuevoRecordar(buildRecordarString(date, recordarHoraValue));
    }
  };

  const handleHoraChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowHoraPicker(false);
    if (date && event.type !== "dismissed") {
      setRecordarHoraValue(date);
      setNuevoRecordar(buildRecordarString(recordarFechaValue, date));
    }
  };

  // Opciones de entidades para los dropdowns del formulario
  const animalesOpciones = animales.map((a) => ({
    id: a.Animal_id,
    nombre: a.Nombre,
  }));
  const cultivosOpciones = cultivos.map((c) => ({
    id: c.Cultivo_id,
    nombre: c.Nombre,
  }));
  const entidadData =
    nuevaEntidadTipo === "animal"
      ? animalesOpciones
      : nuevaEntidadTipo === "cultivo"
        ? cultivosOpciones
        : [];

  // Filtrado por categoría y orden por fecha
  const filtrados = useMemo(() => {
    let data =
      categoriaActiva === "Todos"
        ? recordatorios
        : recordatorios.filter(
            (r) =>
              r.Entidad_Tipo ===
              (categoriaActiva === "Animales" ? "animal" : "cultivo"),
          );

    if (ordenDescendente) {
      data = [...data].sort(
        (a, b) =>
          new Date(b.Recordar).getTime() - new Date(a.Recordar).getTime(),
      );
    }

    return data;
  }, [categoriaActiva, recordatorios, ordenDescendente]);

  const resetModal = () => {
    setNuevoTitulo("");
    setNuevaEntidadTipo("");
    setNuevaEntidadTipoId("");
    setNuevaEntidadId(0);
    setNuevaDescripcion("");
    setNuevoRecordar("");
    setRecordarFechaValue(new Date());
    setRecordarHoraValue(new Date());
  };

  /** Valida y envía el nuevo recordatorio al backend. */
  const agregar = async () => {
    if (!nuevoTitulo.trim()) {
      Alert.alert("Error", "El título no puede estar vacío.");
      return;
    }
    if (!nuevaEntidadTipo) {
      Alert.alert("Error", "Debes seleccionar una categoría.");
      return;
    }
    if (!nuevaEntidadId) {
      Alert.alert(
        "Error",
        "Debes seleccionar un animal o cultivo relacionado.",
      );
      return;
    }
    if (!nuevoRecordar.trim()) {
      Alert.alert("Error", "El campo 'Recordar el' no puede estar vacío.");
      return;
    }

    setGuardando(true);
    const ok = await crearRecordatorio({
      Titulo: nuevoTitulo.trim(),
      Entidad_Tipo: nuevaEntidadTipo as EntidadTipo,
      Entidad_id: nuevaEntidadId,
      Descripcion: nuevaDescripcion.trim() || null,
      Recordar: nuevoRecordar.trim(),
    });
    setGuardando(false);

    if (ok) {
      resetModal();
      setModalVisible(false);
    } else {
      Alert.alert(
        "Error",
        "No se pudo guardar el recordatorio. Intenta de nuevo.",
      );
    }
  };

  /** Confirma y elimina un recordatorio del backend. */
  const confirmarEliminar = (id: number) => {
    Alert.alert(
      "Eliminar Recordatorio",
      "¿Estás seguro de que quieres eliminar este recordatorio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => eliminarRecordatorio(id),
        },
      ],
    );
  };

  const categoriasFiltro: CategoriaFiltro[] = ["Todos", "Animales", "Cultivos"];

  const renderDeleteAction = (id: number) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => eliminarRecordatorio(id)}
    >
      <Text style={styles.deleteActionText}>🗑</Text>
      <Text style={styles.deleteActionLabel}>Eliminar</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenHeader
        title="Recordatorios"
        actions={[
          {
            icon: (
              <FilterIcon
                width={22}
                height={22}
                style={{ position: "absolute", top: 18, right: 20 }}
              />
            ),
            onPress: () => setFilterModalVisible(true),
          },
          {
            icon: (
              <Text
                style={{
                  fontSize: 35,
                  color: Colors.PRIMARY_GREEN,
                  fontWeight: "600",
                }}
              >
                +
              </Text>
            ),
            onPress: () => setModalVisible(true),
          },
        ]}
      />
      <NavBar />
      <View style={[styles.container, { backgroundColor: t.bg }]}>
        {/* Tabs de filtro */}
        <View
          style={[
            styles.tabs,
            { backgroundColor: t.card, borderColor: t.border },
          ]}
        >
          {categoriasFiltro.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.tab, categoriaActiva === cat && styles.tabActivo]}
              onPress={() => setCategoriaActiva(cat)}
            >
              <Text
                style={[
                  styles.tabText,
                  categoriaActiva === cat && styles.tabTextActivo,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.PRIMARY_GREEN}
            style={{ marginTop: 24 }}
          />
        )}
        {error && !loading && <Text style={styles.errorText}>{error}</Text>}

        {!loading && (
          <FlatList
            data={filtrados}
            keyExtractor={(item) => String(item.Recordatorio_id)}
            contentContainerStyle={{ paddingBottom: 140 }}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: t.subtitle }]}>
                No hay recordatorios.
              </Text>
            }
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={() =>
                  renderDeleteAction(item.Recordatorio_id)
                }
                overshootRight={false}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onLongPress={() => confirmarEliminar(item.Recordatorio_id)}
                  delayLongPress={500}
                >
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: t.card, borderColor: t.border },
                    ]}
                  >
                    {/* Checkbox para marcar como completado */}
                    <TouchableOpacity
                      onPress={() =>
                        toggleRecordatorio(item.Recordatorio_id, item.Cancelado)
                      }
                      style={[
                        styles.checkbox,
                        item.Cancelado && styles.checkboxActivo,
                      ]}
                    >
                      {item.Cancelado && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>

                    <View style={styles.cardContent}>
                      <Text
                        style={[
                          styles.cardTitulo,
                          { color: t.title },
                          item.Cancelado && styles.cardTituloTachado,
                        ]}
                      >
                        {item.Titulo}
                      </Text>
                      <Text style={[styles.cardFecha, { color: t.subtitle }]}>
                        {formatDate(item.Recordar)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.badge,
                        item.Entidad_Tipo === "animal"
                          ? styles.badgeAnimal
                          : styles.badgeCultivo,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          item.Entidad_Tipo === "animal"
                            ? styles.badgeTextAnimal
                            : styles.badgeTextCultivo,
                        ]}
                      >
                        {item.Entidad_Tipo === "animal" ? "Animal" : "Cultivo"}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            )}
          />
        )}
      </View>

      {/* Modal de filtro por fecha */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.filterModalContainer, { backgroundColor: t.card }]}>
                <Text style={[styles.modalTitle, { color: t.title }]}>
                  Ordenar por fecha
                </Text>

                <ScrollView contentContainerStyle={{ gap: 10 }}>
                  {[
                    { label: "Sin orden", value: false },
                    { label: "Más reciente primero", value: true },
                  ].map((op) => (
                    <TouchableOpacity
                      key={String(op.value)}
                      style={[
                        styles.opcionBtn,
                        { borderColor: t.border },
                        ordenDescendente === op.value && styles.opcionBtnActivo,
                      ]}
                      onPress={() => {
                        setOrdenDescendente(op.value);
                        setFilterModalVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.opcionBtnText,
                          { color: t.subtitle },
                          ordenDescendente === op.value &&
                            styles.opcionBtnTextActivo,
                        ]}
                      >
                        {op.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.cerrarBtn}
                  onPress={() => setFilterModalVisible(false)}
                >
                  <Text style={styles.cerrarBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de creación de recordatorio */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <View style={[styles.modalContainer, { backgroundColor: t.card }]}>
                <Text style={[styles.modalTitle, { color: t.title }]}>Nuevo Recordatorio</Text>

                <Text style={[styles.modalLabel, { color: t.title }]}>Título</Text>
                <TextInput
                  style={[styles.modalInput, { backgroundColor: t.input, borderColor: t.border, color: t.title }]}
                  placeholder="Título del recordatorio"
                  placeholderTextColor={t.placeholder}
                  value={nuevoTitulo}
                  onChangeText={setNuevoTitulo}
                />

                <Text style={[styles.modalLabel, { color: t.title }]}>Categoría</Text>
                <Dropdown
                  data={entidadTipoOpciones}
                  placeholder="Seleccione una categoría"
                  value={nuevaEntidadTipoId}
                  onValueChange={(val) => {
                    const encontrado = entidadTipoOpciones.find(
                      (o) => o.id === Number(val),
                    );
                    if (encontrado) {
                      setNuevaEntidadTipoId(Number(val));
                      setNuevaEntidadTipo(encontrado.value);
                      setNuevaEntidadId(0);
                    }
                  }}
                />

                {/* Dropdown dinámico de animales o cultivos según categoría */}
                {nuevaEntidadTipo !== "" && (
                  <>
                    <Text style={styles.modalLabel}>
                      {nuevaEntidadTipo === "animal"
                        ? "Animal relacionado"
                        : "Cultivo relacionado"}
                    </Text>
                    <Dropdown
                      data={entidadData}
                      placeholder={
                        nuevaEntidadTipo === "animal"
                          ? "Seleccione un animal"
                          : "Seleccione un cultivo"
                      }
                      value={nuevaEntidadId || ""}
                      onValueChange={(val) => setNuevaEntidadId(Number(val))}
                    />
                  </>
                )}

                <Text style={[styles.modalLabel, { color: t.title }]}>Descripción</Text>
                <TextInput
                  style={[styles.modalTextArea, { backgroundColor: t.input, borderColor: t.border, color: t.title }]}
                  placeholder="Descripción del recordatorio (opcional)"
                  placeholderTextColor={t.placeholder}
                  value={nuevaDescripcion}
                  onChangeText={setNuevaDescripcion}
                  multiline
                  numberOfLines={3}
                />

                <Text style={[styles.modalLabel, { color: t.title }]}>Recordar el</Text>
                <View style={styles.dateRow}>
                  <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: t.input, borderColor: t.border }]}
                    onPress={() => setShowFechaPicker(true)}
                  >
                    <Text style={nuevoRecordar ? [styles.dateText, { color: t.title }] : styles.datePlaceholder}>
                      {nuevoRecordar ? nuevoRecordar.split(" ")[0] : "YYYY-MM-DD"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: t.input, borderColor: t.border }]}
                    onPress={() => setShowHoraPicker(true)}
                  >
                    <Text style={nuevoRecordar ? [styles.dateText, { color: t.title }] : styles.datePlaceholder}>
                      {nuevoRecordar ? nuevoRecordar.split(" ")[1] ?? "HH:MM" : "HH:MM"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {showFechaPicker && (
                  <DateTimePicker
                    value={recordarFechaValue}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleFechaChange}
                  />
                )}
                {showHoraPicker && (
                  <DateTimePicker
                    value={recordarHoraValue}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleHoraChange}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: t.input, borderColor: t.border }]}
                    disabled={guardando}
                    onPress={() => {
                      resetModal();
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.cancelText, { color: t.title }]}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveButton, guardando && { opacity: 0.7 }]}
                    onPress={agregar}
                    disabled={guardando}
                  >
                    {guardando ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.saveText}>Guardar</Text>
                    )}
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
function formatDate(date:string){
  const dateObject = new Date(date)
  const fechaFormated = new Intl.DateTimeFormat('es-CR',{
    day:'2-digit',
    month:"2-digit",
    year:'numeric'

  }).format(dateObject).toString()
  return fechaFormated
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  tabActivo: { backgroundColor: Colors.PRIMARY_GREEN },
  tabText: { fontSize: 14, color: Colors.SUBTITLE, fontWeight: "500" },
  tabTextActivo: { color: "#fff", fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.CARD_DETAILS,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.INPUT_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActivo: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderColor: Colors.PRIMARY_GREEN,
  },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "700" },
  cardContent: { flex: 1, gap: 4 },
  cardTitulo: { fontSize: 14, color: Colors.TITLE, fontWeight: "500" },
  cardTituloTachado: {
    textDecorationLine: "line-through",
    color: Colors.PLACEHOLDER_GRAY,
  },
  cardFecha: { fontSize: 12, color: Colors.PLACEHOLDER_GRAY },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeAnimal: { backgroundColor: "#F3F4F6" },
  badgeCultivo: { backgroundColor: "#DCFCE7" },
  badgeText: { fontSize: 12, fontWeight: "500" },
  badgeTextAnimal: { color: Colors.SUBTITLE },
  badgeTextCultivo: { color: Colors.PRIMARY_GREEN },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: 10,
  },
  deleteActionText: { fontSize: 20 },
  deleteActionLabel: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginTop: 2,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  emptyText: { textAlign: "center", marginTop: 32, fontSize: 14 },
  filterModalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
  },
  opcionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  opcionBtnActivo: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderColor: Colors.PRIMARY_GREEN,
  },
  opcionBtnText: {
    fontSize: 15,
    fontWeight: "500",
  },
  opcionBtnTextActivo: {
    color: "#fff",
    fontWeight: "600",
  },
  cerrarBtn: {
    marginTop: 4,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  cerrarBtnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: Colors.CARD_DETAILS,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.TITLE,
    marginBottom: 4,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.TITLE,
    marginTop: 4,
  },
  modalInput: {
    backgroundColor: Colors.BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.TITLE,
  },
  modalTextArea: {
    backgroundColor: Colors.BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.TITLE,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 12 },
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
  cancelText: { fontSize: 16, color: Colors.TITLE, fontWeight: "500" },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  dateRow: { flexDirection: "row", gap: 8 },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: { fontSize: 15 },
  datePlaceholder: { fontSize: 15, color: Colors.PLACEHOLDER_GRAY },
});
