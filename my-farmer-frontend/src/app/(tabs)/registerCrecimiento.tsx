/**
 * Pantalla de Registro/Edición de Crecimiento (registerCrecimiento.tsx)
 *
 * Permite registrar o editar un registro de crecimiento para un cultivo.
 * Recibe como parámetros:
 *  - cultivo_id    → ID del cultivo al que pertenece el registro (requerido)
 *  - crecimiento_id → ID del registro a editar (opcional, si no se pasa es modo creación)
 *
 * Campos del formulario:
 *  - Altura        → Altura de la planta en cm (número, opcional)
 *  - Observaciones → Notas del registro (texto, opcional)
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/supabase/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import ScreenHeader from "@/components/header";
import Colors from "@/constants/colors";
import {
  crearCrecimiento,
  actualizarCrecimiento,
  getCrecimientoById,
} from "@/services/crecimientosService";

export default function RegisterCrecimientoScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { t } = useTheme();

  const { cultivo_id, crecimiento_id } = useLocalSearchParams<{
    cultivo_id: string;
    crecimiento_id?: string;
  }>();

  const esEdicion = Boolean(crecimiento_id);

  const [altura, setAltura] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Cargar datos existentes si es modo edición
  useEffect(() => {
    if (!esEdicion || !session?.access_token || !crecimiento_id) return;
    setCargando(true);
    getCrecimientoById(Number(crecimiento_id), session.access_token)
      .then((reg) => {
        setAltura(reg.Altura != null ? String(reg.Altura) : "");
        setObservaciones(reg.Observaciones ?? "");
      })
      .catch(() => Alert.alert("Error", "No se pudo cargar el registro."))
      .finally(() => setCargando(false));
  }, [esEdicion, crecimiento_id, session?.access_token]);

  const handleGuardar = async () => {
    if (!session?.access_token || !cultivo_id) return;

    const alturaNum = altura.trim() ? parseFloat(altura.trim()) : null;
    if (altura.trim() && isNaN(alturaNum!)) {
      Alert.alert("Error", "La altura debe ser un número válido.");
      return;
    }

    setGuardando(true);
    try {
      if (esEdicion && crecimiento_id) {
        await actualizarCrecimiento(
          Number(crecimiento_id),
          { Altura: alturaNum, Observaciones: observaciones.trim() || null },
          session.access_token,
        );
      } else {
        await crearCrecimiento(
          {
            Cultivo_id: Number(cultivo_id),
            Altura: alturaNum,
            Observaciones: observaciones.trim() || null,
          },
          session.access_token,
        );
      }
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo guardar el registro.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <>
        <ScreenHeader title={esEdicion ? "Editar Crecimiento" : "Registrar Crecimiento"} />
        <View style={[styles.centered, { backgroundColor: t.bg }]}>
          <ActivityIndicator size="large" color={Colors.PRIMARY_GREEN} />
        </View>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title={esEdicion ? "Editar Crecimiento" : "Registrar Crecimiento"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={[styles.container, { backgroundColor: t.bg }]}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
            <Text style={[styles.label, { color: t.title }]}>Altura (cm)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: t.input, borderColor: t.border, color: t.title }]}
              placeholder="Ej: 45"
              placeholderTextColor={t.placeholder}
              value={altura}
              onChangeText={setAltura}
              keyboardType="decimal-pad"
            />

            <Text style={[styles.label, { color: t.title }]}>Observaciones</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: t.input, borderColor: t.border, color: t.title }]}
              placeholder="Notas sobre el estado del cultivo (opcional)"
              placeholderTextColor={t.placeholder}
              value={observaciones}
              onChangeText={setObservaciones}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: t.card, borderColor: t.border }]}
              onPress={() => router.back()}
              disabled={guardando}
            >
              <Text style={[styles.cancelText, { color: t.title }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, guardando && { opacity: 0.7 }]}
              onPress={handleGuardar}
              disabled={guardando}
            >
              {guardando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>
                  {esEdicion ? "Actualizar" : "Guardar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 100,
  },
  buttons: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 16, fontWeight: "500" },
  saveBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.PRIMARY_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});
