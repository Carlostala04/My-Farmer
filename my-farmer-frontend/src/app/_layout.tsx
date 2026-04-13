import { Slot } from "expo-router";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/supabase/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { LogBox } from "react-native";

// Ocultar advertencias de expo-notifications en Expo Go / Android sin FCM configurado
LogBox.ignoreLogs([
  "expo-notifications",
  "Android Push",
  "FirebaseApp",
]);

function AppContent() {
  const { darkMode } = useTheme();
  const { session } = useAuth();

  // Registra el push token del dispositivo en el backend en cuanto el usuario está autenticado
  useNotifications(session?.access_token ?? null);

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
