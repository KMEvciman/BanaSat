import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useColorScheme } from "nativewind";
import * as SecureStore from "expo-secure-store";

type Mode = "light" | "dark";
interface ThemeContextType {
  mode: Mode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const KEY = "banasat_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((v) => {
      if (v === "light" || v === "dark") setColorScheme(v);
    });
  }, [setColorScheme]);

  const mode: Mode = colorScheme === "dark" ? "dark" : "light";
  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setColorScheme(next);
    SecureStore.setItemAsync(KEY, next);
  };

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
