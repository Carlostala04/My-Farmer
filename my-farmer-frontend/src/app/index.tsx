import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/supabase/useAuth";

/**
 * Pantalla de entrada de la app.
 * - Espera a que el estado de sesión esté listo (initialized).
 * - Si no hay sesión activa → redirige al login.
 * - Si hay sesión activa → redirige al home.
 */
export default function IndexScreen() {
  const { session, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    if (session) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(tabs)/login");
    }
  }, [initialized, session]);

  // Pantalla de carga mientras se verifica la sesión
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});
