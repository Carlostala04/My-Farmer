import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecuperarPinScreen() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  function handleVerificar() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/(tabs)/recuperar-contrasena" as any);
    }, 800);
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
        <Text style={styles.resend}>
          ¿No recibiste el PIN?{" "}
          <Text style={{ color: Colors.PRIMARY_GREEN, fontWeight: "700" }}>
            Reenviar
          </Text>
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            pin.length < 6 && styles.buttonDisabled,
          ]}
          onPress={handleVerificar}
          disabled={pin.length < 6 || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verificando..." : "Verificar PIN"}
          </Text>
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
});
