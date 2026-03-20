import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
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
import { Spacing } from "@/constants/theme";
import GoogleLogo from "@/components/ui/google";
import colors from "@/constants/colors";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [pressedButton, setPressedButton] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.six,
            paddingBottom: insets.bottom + Spacing.four,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={require("@/assets/images/icono-app.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.titleText}>MyFarmer</Text>
        </View>

        {showError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              Error de autenticación: El correo o la contraseña son incorrectos.
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <EmailIcon
              color={colors.PLACEHOLDER_GRAY}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico o Teléfono"
              placeholderTextColor={colors.PLACEHOLDER_GRAY}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputWrapper}>
            <LockIcon
              color={colors.PLACEHOLDER_GRAY}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Contraseña"
              placeholderTextColor={colors.PLACEHOLDER_GRAY}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={8}
            >
              {showPassword ? (
                <EyeOffIcon color={colors.PLACEHOLDER_GRAY} />
              ) : (
                <EyeIcon color={colors.PLACEHOLDER_GRAY} />
              )}
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
            onPress={() => {}}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </Pressable>

          <Pressable style={styles.googleButton}>
            <GoogleLogo style={styles.googleButtonIcon} />
            <Text style={styles.googleButtonText}>
              Iniciar sesión con Google
            </Text>
          </Pressable>
          <Link href="/recover" asChild>
            <Pressable
              style={styles.forgotLink}
              onPressIn={() => setPressedButton(true)}
              onPressOut={() => setPressedButton(false)}
            >
              <Text
                style={[
                  styles.forgotText,
                  {
                    color: pressedButton
                      ? colors.PRIMARY_GREEN
                      : colors.LINK_GRAY,
                  },
                ]}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </Link>

          <View style={styles.registerSection}>
            <Text style={styles.registerQuestion}>¿No tienes una cuenta?</Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.PRIMARY_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  logo: {
    width: 48,
    height: 48,
  },
  welcomeText: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "600",
    marginBottom: 2,
  },
  titleText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "700",
  },
  errorBox: {
    width: "100%",
    backgroundColor: colors.ERROR_BG,
    borderWidth: 1,
    borderColor: colors.ERROR_BORDER,
    borderRadius: 8,
    padding: Spacing.three,
    marginBottom: Spacing.four,
    display: "none",
  },
  errorText: {
    fontSize: 14,
    color: colors.ERROR_TEXT,
    textAlign: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.INPUT_BORDER,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
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
  loginButton: {
    backgroundColor: colors.PRIMARY_GREEN,
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  loginButtonPressed: {
    opacity: 0.9,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  forgotLink: {
    alignSelf: "center",
    marginBottom: Spacing.four,
  },
  forgotText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.LINK_GRAY,
  },
  registerSection: {
    alignItems: "center",
  },
  registerQuestion: {
    fontSize: 16,
    color: colors.LINK_GRAY,
    marginBottom: 4,
  },
  registerLink: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.PRIMARY_GREEN,
    marginTop: Spacing.four,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.PLACEHOLDER_GRAY,
    borderRadius: 12,
    padding: Spacing.three,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  googleButtonIcon: {
    marginRight: Spacing.three,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  hover: {
    color: colors.PRIMARY_GREEN,
  },
});
