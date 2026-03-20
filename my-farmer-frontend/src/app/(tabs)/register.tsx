import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EmailIcon from "@/components/ui/email";
import LockIcon from "@/components/ui/lock";
import EyeIcon from "@/components/ui/eye";
import EyeOffIcon from "@/components/ui/eye-off";
import GoogleLogo from "@/components/ui/google";
import UserIcon from "@/components/ui/user";
import Colors from "@/constants/colors";
import { Spacing } from "@/constants/theme";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [nombreDeUsuario, setNombreDeUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmContrasena, setConfirmContrasena] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + Spacing.four,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Regístrate</Text>
        <Text style={styles.subtitle}>Crea tu cuenta en MyFarmer</Text>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputWrapper, styles.inputHalf]}>
              <UserIcon color={Colors.PLACEHOLDER_GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor={Colors.PLACEHOLDER_GRAY}
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputWrapper, styles.inputHalf]}>
              <UserIcon color={Colors.PLACEHOLDER_GRAY} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor={Colors.PLACEHOLDER_GRAY}
                value={apellido}
                onChangeText={setApellido}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <UserIcon color={Colors.PLACEHOLDER_GRAY} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={nombreDeUsuario}
              onChangeText={setNombreDeUsuario}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <EmailIcon color={Colors.PLACEHOLDER_GRAY} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={correo}
              onChangeText={setCorreo}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputWrapper}>
            <LockIcon color={Colors.PLACEHOLDER_GRAY} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Contraseña"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={8}
            >
              {showPassword ? (
                <EyeOffIcon color={Colors.PLACEHOLDER_GRAY} />
              ) : (
                <EyeIcon color={Colors.PLACEHOLDER_GRAY} />
              )}
            </Pressable>
          </View>

          <View style={styles.inputWrapper}>
            <LockIcon color={Colors.PLACEHOLDER_GRAY} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Confirmar contraseña"
              placeholderTextColor={Colors.PLACEHOLDER_GRAY}
              value={confirmContrasena}
              onChangeText={setConfirmContrasena}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              hitSlop={8}
            >
              {showConfirmPassword ? (
                <EyeOffIcon color={Colors.PLACEHOLDER_GRAY} />
              ) : (
                <EyeIcon color={Colors.PLACEHOLDER_GRAY} />
              )}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {}}
          >
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.googleButton}>
            <GoogleLogo style={styles.googleButtonIcon} />
            <Text style={styles.googleButtonText}>
              Iniciar sesión con Google
            </Text>
          </Pressable>

          <View style={styles.loginSection}>
            <Text style={styles.loginQuestion}>¿Ya tienes una cuenta?</Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.five,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.LINK_GRAY,
    marginBottom: Spacing.four,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  inputHalf: {
    flex: 1,
  },
  inputIcon: {
    marginRight: Spacing.two,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000000",
    paddingVertical: 0,
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    padding: Spacing.one,
  },
  registerButton: {
    backgroundColor: Colors.PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.INPUT_BORDER,
  },
  dividerText: {
    marginHorizontal: Spacing.three,
    fontSize: 14,
    color: Colors.LINK_GRAY,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.INPUT_BORDER,
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  googleButtonIcon: {
    marginRight: Spacing.two,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  loginSection: {
    alignItems: "center",
  },
  loginQuestion: {
    fontSize: 14,
    color: Colors.LINK_GRAY,
    marginBottom: 4,
  },
  loginLink: {
    marginTop:10,
    fontSize: 16,
    fontWeight: "800",
    color: Colors.PRIMARY_GREEN,
  },
});
