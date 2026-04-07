import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/colors";
import { Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApiError } from "@/services/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function RecuperarPinScreen() {
  const { correo } = useLocalSearchParams<{ correo: string }>();
  const [pin, setPin] = useState("");
  const [reenvioLoading, setReenvioLoading] = useState(false);
  const [error, setError] = useState("");
  const [reenvioMsg, setReenvioMsg] = useState("");

  function handleVerificar() {
    // Solo navega con los params; la validación real se hace en el paso 3
    router.push({
      pathname: "/(tabs)/recuperar-contrasena" as any,
      params: { correo, pin },
    });
  }

  async function handleReenviar() {
    if (!correo) return;
    setReenvioMsg("");
    setError("");
    setReenvioLoading(true);
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
          : (data.message ?? "Error al reenviar");
        throw new ApiError(res.status, msg);
      }
      setPin("");
      setReenvioMsg("PIN reenviado. Revisa tu correo.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al reenviar el PIN");
    } finally {
      setReenvioLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backTxt}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.steps}>
          <View style={[styles.step, styles.stepOn]} />
          <View style={[styles.step, styles.stepOn]} />
          <View style={styles.step} />
        </View>
        <Text style={styles.title}>Revisa tu correo</Text>
        <Text style={styles.sub}>
          Ingresa el PIN de 6 dígitos que te enviamos.
        </Text>
        <View style={styles.pinRow}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[styles.pinBox, pin.length > i && styles.pinBoxFilled]}
            >
              <Text style={styles.pinChar}>{pin[i] || ""}</Text>
            </View>
          ))}
        </View>
        <TextInput
          value={pin}
          onChangeText={(t) => setPin(t.replace(/\D/g, "").slice(0, 6))}
          keyboardType="numeric"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus
        />
        <TouchableOpacity onPress={handleReenviar} disabled={reenvioLoading}>
          <Text style={styles.resend}>
            ¿No recibiste el PIN?{" "}
            <Text style={{ color: Colors.PRIMARY_GREEN, fontWeight: "700" }}>
              {reenvioLoading ? "Enviando..." : "Reenviar"}
            </Text>
          </Text>
        </TouchableOpacity>
        {!!reenvioMsg && <Text style={styles.successText}>{reenvioMsg}</Text>}
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            pin.length < 6 && styles.buttonDisabled,
          ]}
          onPress={handleVerificar}
          disabled={pin.length < 6}
        >
          <Text style={styles.buttonText}>Verificar PIN</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, padding: Spacing.three },
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
    marginBottom: Spacing.four,
  },
  pinRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  pinBox: {
    width: 48,
    height: 56,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.INPUT_BORDER,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  pinBoxFilled: {
    borderColor: Colors.PRIMARY_GREEN,
    backgroundColor: "#F0FDF4",
  },
  pinChar: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.PRIMARY_GREEN,
  },
  hiddenInput: { position: "absolute", opacity: 0, height: 0 },
  resend: {
    fontSize: 13,
    color: Colors.PLACEHOLDER_GRAY,
    textAlign: "center",
    marginBottom: Spacing.four,
  },
  button: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: { opacity: 0.9 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  successText: {
    fontSize: 13,
    color: Colors.PRIMARY_GREEN,
    textAlign: "center",
    marginBottom: Spacing.two,
  },
  errorText: {
    fontSize: 13,
    color: Colors.ERROR_TEXT,
    textAlign: "center",
    marginBottom: Spacing.two,
  },
});
