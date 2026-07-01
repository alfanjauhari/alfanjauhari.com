import { createContext, useContext, createSignal, createEffect, onMount, type JSX } from "solid-js";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

interface ThemeContextValue {
	theme: () => Theme;
	setTheme: (t: Theme) => void;
	resolved: () => "light" | "dark";
}

const ThemeCtx = createContext<ThemeContextValue>();

function getStored(): Theme {
	if (typeof window === "undefined") return "system";
	try {
		return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
	} catch {
		return "system";
	}
}

function getSystem(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function resolve(t: Theme): "light" | "dark" {
	return t === "system" ? getSystem() : t;
}

function apply(r: "light" | "dark") {
	document.documentElement.setAttribute("data-theme", r);
	document.documentElement.style.colorScheme = r;
}

export function ThemeProvider(props: { children: JSX.Element }) {
	const [theme, setThemeRaw] = createSignal<Theme>(getStored());
	const [resolved, setResolved] = createSignal<"light" | "dark">(
		resolve(getStored()),
	);

	function setTheme(t: Theme) {
		setThemeRaw(t);
		localStorage.setItem(STORAGE_KEY, t);
	}

	createEffect(() => {
		const r = resolve(theme());
		setResolved(r);
		apply(r);
	});

	onMount(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (theme() === "system") {
				const r = getSystem();
				setResolved(r);
				apply(r);
			}
		};
		media.addEventListener("change", handler);
		return () => media.removeEventListener("change", handler);
	});

	return (
		<ThemeCtx.Provider value={{ theme, setTheme, resolved }}>
			{props.children}
		</ThemeCtx.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeCtx);
	if (!ctx) {
		return {
			theme: () => "system" as Theme,
			setTheme: (_: Theme) => {},
			resolved: () => "light" as "light" | "dark",
		};
	}
	return ctx;
}
