import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { Spacing } from "@/constants/theme";

export default function RecuperarContrasenaScreen() {
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  function handleGuardar() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/login");
    }, 800);
  }

  const mismatch = !!confirmar && nueva !== confirmar;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backTxt}>← Volver</Text>
          </TouchableOpacity>
          <View style={styles.steps}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.step, styles.stepOn]} />
            ))}
          </View>
          <Text style={styles.title}>Nueva contraseña</Text>
          <Text style={styles.sub}>
            Crea una contraseña segura para tu cuenta.
          </Text>

          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            style={styles.input}
            value={nueva}
            onChangeText={setNueva}
            secureTextEntry
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={[styles.input, mismatch && styles.inputError]}
            value={confirmar}
            onChangeText={setConfirmar}
            secureTextEntry
            placeholder="Repite la contraseña"
            placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          />
          {mismatch && (
            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              (!nueva || nueva !== confirmar) && styles.buttonDisabled,
            ]}
            onPress={handleGuardar}
            disabled={!nueva || nueva !== confirmar || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Guardando..." : "Guardar contraseña"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flexGrow: 1, padding: Spacing.three },
  back: { marginBottom: Spacing.three },
  backTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.PRIMARY_GREEN,
  },
  steps: { flexDirection: "row", gap: 5, marginBottom: Spacing.three },
  step: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: Colors.PRIMARY_GREEN,
  },
  stepOn: { backgroundColor: Colors.PRIMARY_GREEN },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.TITLE,
    marginBottom: Spacing.two,
  },
  sub: {
    fontSize: 13,
    color: Colors.PLACEHOLDER_GRAY,
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.TITLE,
    marginBottom: Spacing.one,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: Colors.TITLE,
    backgroundColor: "#FFFFFF",
    marginBottom: Spacing.three,
  },
  inputError: {
    borderColor: Colors.ERROR_BORDER,
    marginBottom: Spacing.one,
  },
  errorText: {
    fontSize: 12,
    color: Colors.ERROR_TEXT,
    marginBottom: Spacing.three,
  },
  button: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
