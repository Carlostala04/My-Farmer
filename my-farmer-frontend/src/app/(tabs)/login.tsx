import { Link, useRouter } from "expo-router";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import EmailIcon from "@/components/ui/email";
import LockIcon from "@/components/ui/lock";
import EyeIcon from "@/components/ui/eye";
import EyeOffIcon from "@/components/ui/eye-off";
import { Spacing } from "@/constants/theme";
import GoogleLogo from "@/components/ui/google";
import colors from "@/constants/colors";
import { supabase } from "@/supabase/supabaseClient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.40.224.63:3000";
WebBrowser.maybeCompleteAuthSession();
export default function LoginScreen() {
  // Estados para el formulario y el estado de carga
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pressedButton, setPressedButton] = useState(false);
  // Función para iniciar sesión
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false); // Solo quitamos carga si hay error, si no, navegamos
    } else {
      // 🟢 Sincronizar usuario con el backend
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        if (currentSession) {
          await fetch(`${API_URL}/usuarios/me`, {
            headers: { Authorization: `Bearer ${currentSession.access_token}` },
          });
        }
      } catch (e) {
        console.log("Error al sincronizar usuario con backend:", e);
      }

      Alert.alert("Éxito", "Has iniciado sesión correctamente");
      router.replace("/(tabs)/home"); // Redirigir a la pantalla principal
    }
  }

  // 🔥 GOOGLE LOGIN (PARA EXPO GO)
  async function handleGoogleLogin() {
    try {
      setLoading(true);

      // ✅ Usamos Linking.createURL que es más preciso para el path /--/ en Expo Go
      const redirectUri = Linking.createURL("/");
      console.log("1. URL que debes tener en Supabase:", redirectUri);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
          queryParams: { prompt: "select_account" },
        },
      });

      if (error) throw error;

      if (data?.url) {
        console.log("2. Abriendo navegador...");
        // openAuthSessionAsync es el método correcto para esperar la redirección
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri,
        );

        console.log("3. Resultado del navegador:", result.type);

        if (result.type === "success" && result.url) {
          console.log("4. URL de retorno recibida:");

          //  Extraer tokens de forma más segura
          let access_token = null;
          let refresh_token = null;

          if (result.url.includes("#")) {
            const hash = result.url.split("#")[1];
            const params = new URLSearchParams(hash);
            access_token = params.get("access_token");
            console.log("access token: ", access_token);
            refresh_token = params.get("refresh_token");
          } else if (result.url.includes("?")) {
            const query = result.url.split("?")[1];
            const params = new URLSearchParams(query);
            access_token = params.get("access_token");
            refresh_token = params.get("refresh_token");
          }

          console.log("5. Tokens encontrados:", {
            hasAccess: !!access_token,
            hasRefresh: !!refresh_token,
          });

          if (access_token && refresh_token) {
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

            if (sessionError) {
              console.log("Error setSession:", sessionError.message);
              throw sessionError;
            }

            const session = sessionData.session;
            console.log("6. Sesión de Supabase:", session ? "OK" : "NULL");

            if (session && session.user) {
              const user = session.user;
              console.log("7. Usuario obtenido:", user.email);

              // 🟢 Sincronizar usuario con el backend
              try {
                await fetch(`${API_URL}/usuarios/me`, {
                  headers: { Authorization: `Bearer ${session.access_token}` },
                });
              } catch (e) {
                console.log("Error al sincronizar usuario con backend:", e);
              }

              console.log("8. Redirigiendo a Mapa...");
              router.replace("/home");
            } else {
              console.log("Error: No hay sesión o usuario tras setSession");
              Alert.alert("Error", "El correo o contraseña son incorrectos.");
            }
          } else {
            console.log("Error: No se encontraron tokens en la URL");
            Alert.alert("Error", "La respuesta de Google no fue válida.");
          }
        } else {
          console.log("El flujo terminó sin éxito:", result.type);
        }
      }
    } catch (err) {
      console.log("Error Google Login:", err);
      Alert.alert("Error", "No se pudo iniciar sesión con Google");
    } finally {
      setLoading(false);
    }
  }

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
              onChangeText={(text) => setEmail(text)}
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
              onChangeText={(text) => setPassword(text)}
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
              loading && { opacity: 0.7 },
            ]}
            onPress={signInWithEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.googleButton, loading && { opacity: 0.7 }]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <GoogleLogo style={styles.googleButtonIcon} />
            <Text style={styles.googleButtonText}>
              Iniciar sesión con Google
            </Text>
          </Pressable>
          <Link href={"/(tabs)/recuperar-correo" as any} asChild>
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
