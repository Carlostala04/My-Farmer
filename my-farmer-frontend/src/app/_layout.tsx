import { Slot } from "expo-router";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";

function AppContent() {
  const { darkMode } = useTheme();
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
