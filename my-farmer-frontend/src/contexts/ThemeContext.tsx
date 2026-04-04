import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "mf_dark_mode";

type ThemeColors = {
  bg: string;
  card: string;
  title: string;
  subtitle: string;
  border: string;
  navBar: string;
  input: string;
  placeholder: string;
};

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
  t: ThemeColors;
};

const light: ThemeColors = {
  bg: "#F5F5F5",
  card: "#FFFFFF",
  title: "#1A1A1A",
  subtitle: "#666666",
  border: "#D1D5DB",
  navBar: "#FFFFFF",
  input: "#FFFFFF",
  placeholder: "#9CA3AF",
};

const dark: ThemeColors = {
  bg: "#111827",
  card: "#1F2937",
  title: "#F9FAFB",
  subtitle: "#9CA3AF",
  border: "#374151",
  navBar: "#1F2937",
  input: "#374151",
  placeholder: "#6B7280",
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  t: light,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "true") setDarkMode(true);
    });
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem(STORAGE_KEY, String(value));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, t: darkMode ? dark : light }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
