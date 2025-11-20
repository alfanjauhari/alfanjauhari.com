import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setThemeServerFn } from "@/fns/server/common";

export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const defaultThemeContext: ThemeContextType = {
  theme: "system",
  setTheme: () => {},
};

export const ThemeContext =
  createContext<ThemeContextType>(defaultThemeContext);

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }

  return context;
}

export function ThemeProvider({
  children,
  theme: initialTheme,
}: PropsWithChildren<{ theme: Theme }>) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark", "system");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      setThemeServerFn({
        data: newTheme,
      }).then(() => router.invalidate());
    },
    [router],
  );

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
