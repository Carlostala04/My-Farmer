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
import { ApiError } from "@/services/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function RecuperarCorreoScreen() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEnviar() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/solicitar-recuperacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = Array.isArray(data.message)
          ? data.message.join(", ")
          : (data.message ?? "Error al enviar el PIN");
        throw new ApiError(res.status, msg);
      }
      router.push({ pathname: "/(tabs)/recuperar-pin" as any, params: { correo } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar el PIN");
    } finally {
      setLoading(false);
    }
  }

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
            <View style={[styles.step, styles.stepOn]} />
            <View style={styles.step} />
            <View style={styles.step} />
          </View>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.sub}>
            Ingresa tu correo y te enviaremos un PIN de 6 dígitos.
          </Text>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="tu@correo.com"
            placeholderTextColor={Colors.PLACEHOLDER_GRAY}
          />
          <Text style={styles.hint}>Te enviaremos un PIN de 6 dígitos</Text>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              !correo && styles.buttonDisabled,
            ]}
            onPress={handleEnviar}
            disabled={!correo || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Enviando..." : "Enviar PIN"}
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
    backgroundColor: Colors.INPUT_BORDER,
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
    lineHeight: 20,
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
    marginBottom: Spacing.one,
  },
  hint: {
    fontSize: 12,
    color: Colors.PLACEHOLDER_GRAY,
    marginBottom: Spacing.two,
  },
  errorText: {
    fontSize: 13,
    color: Colors.ERROR_TEXT,
    marginBottom: Spacing.two,
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
