"use client";

/*
  This file is adapted from next-themes to work with tanstack start.
  next-themes can be found at https://github.com/pacocoursey/next-themes under the MIT license.
*/

import * as React from "react";

interface ValueObject {
  [themeName: string]: string;
}

export interface UseThemeProps {
  /** List of all available theme names */
  themes: string[];
  /** Forced theme name for the current page */
  forcedTheme?: string | undefined;
  /** Update the theme */
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  /** Active theme name */
  theme?: string | undefined;
  /** If enableSystem is true, returns the System theme preference ("dark" or "light"), regardless what the active theme is */
  systemTheme?: "dark" | "light" | undefined;
}

export type Attribute = `data-${string}` | "class";

export interface ThemeProviderProps extends React.PropsWithChildren {
  /** List of all available theme names */
  themes?: string[] | undefined;
  /** Key used to store theme setting in localStorage */
  storageKey?: string | undefined;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: string | undefined;
  /** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both */
  attribute?: Attribute;
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ValueObject | undefined;
}

const colorSchemes = ["light", "dark"];
const MEDIA = "(prefers-color-scheme: dark)";
const isServer = typeof window === "undefined";
const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const defaultContext: UseThemeProps = { setTheme: (_) => {}, themes: [] };

export const useTheme = () => React.useContext(ThemeContext) ?? defaultContext;

export const ThemeProvider = (props: ThemeProviderProps): React.ReactNode => {
  const context = React.useContext(ThemeContext);

  // Ignore nested context providers, just passthrough children
  if (context) return props.children;
  return <Theme {...props} />;
};

const defaultThemes = ["light", "dark"];

const Theme = ({
  storageKey = "theme",
  defaultTheme = "system",
  themes = defaultThemes,
  attribute = "data-theme",
  value,
  children,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = React.useState(() =>
    getTheme(storageKey, defaultTheme),
  );

  // apply selected theme function (light, dark, system)
  // biome-ignore lint/correctness/useExhaustiveDependencies: We dont need to update the deps
  const applyTheme = React.useCallback((theme: string | undefined) => {
    let resolved = theme;
    if (!resolved) return;

    // If theme is system, resolve it before setting theme
    if (theme === "system") {
      resolved = getSystemTheme();
    }

    const name = value ? value[resolved] : resolved;
    const d = document.documentElement;

    d.setAttribute(attribute, name);

    const fallback = colorSchemes.includes(defaultTheme) ? defaultTheme : null;
    const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback;
    // @ts-expect-error
    d.style.colorScheme = colorScheme;
  }, []);

  const setTheme = React.useCallback(
    (value: React.SetStateAction<string>) => {
      const newTheme =
        typeof value === "function" ? value(theme || defaultTheme) : value;

      setThemeState(newTheme);

      // Save to storage
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (_e) {
        // Unsupported
      }
    },
    [theme, storageKey, defaultTheme],
  );

  const handleMediaQuery = React.useCallback(
    (_: MediaQueryListEvent | MediaQueryList) => {
      if (theme === "system") {
        applyTheme("system");
      }
    },
    [theme, applyTheme],
  );

  // Always listen to System preference
  React.useEffect(() => {
    const media = window.matchMedia(MEDIA);

    // Intentionally use deprecated listener methods to support iOS & old browsers
    media.addListener(handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeListener(handleMediaQuery);
  }, [handleMediaQuery]);

  // localStorage event handling, allow to sync theme changes between tabs
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
      const theme = e.newValue || defaultTheme;
      setTheme(theme);
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, [setTheme, storageKey, defaultTheme]);

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const providerValue = React.useMemo(
    () => ({
      theme,
      setTheme,
      themes: [...themes, "system"],
    }),
    [theme, setTheme, themes],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript defaultTheme={defaultTheme} themes={themes} />
      {children}
    </ThemeContext.Provider>
  );
};

function ThemeScript({
  themes,
  defaultTheme,
}: {
  themes: string[];
  defaultTheme: string;
}) {
  const args = JSON.stringify([themes, defaultTheme]).slice(1, -1);

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required to inject script
      dangerouslySetInnerHTML={{
        __html: `(${script.toString()})(${args})`,
      }}
      suppressHydrationWarning
    />
  );
}

const getTheme = (key: string, fallback?: string) => {
  if (isServer) return undefined;
  let theme: string | undefined;
  try {
    theme = localStorage.getItem(key) || undefined;
  } catch (_e) {
    // Unsupported
  }
  return theme || fallback;
};

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent) => {
  const event = e ?? window.matchMedia(MEDIA);
  const isDark = event.matches;
  const systemTheme = isDark ? "dark" : "light";
  return systemTheme;
};

const script = (themes: string[], defaultTheme: string) => {
  const attribute = "data-theme";

  const el = document.documentElement;

  function updateDOM(theme: string, hasVisited: boolean) {
    if (hasVisited) {
      el.setAttribute("data-has-visited", String(hasVisited));
    }

    el.setAttribute(attribute, theme);

    setColorScheme(theme);
  }

  function setColorScheme(theme: string) {
    if (themes.includes(theme)) {
      el.style.colorScheme = theme;
    }
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  try {
    const hasVisited = localStorage.getItem("has-visited");
    const themeName = localStorage.getItem("theme") || defaultTheme;
    const isSystem = themeName === "system";
    const theme = isSystem ? getSystemTheme() : themeName;

    updateDOM(theme, hasVisited ? hasVisited === "true" : false);
  } catch (_e) {
    //
  }
};
