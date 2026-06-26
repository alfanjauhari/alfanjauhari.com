import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-solid";
import { createSignal, createEffect, onMount } from "solid-js";

const storageKey = "theme";

function getStoredTheme(): string {
	if (typeof window === "undefined") return "system";
	try {
		return localStorage.getItem(storageKey) || "system";
	} catch {
		return "system";
	}
}

function getSystemTheme(): "light" | "dark" {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function resolveTheme(theme: string): "light" | "dark" {
	return theme === "system" ? getSystemTheme() : (theme as "light" | "dark");
}

function applyTheme(theme: "light" | "dark") {
	document.documentElement.setAttribute("data-theme", theme);
	document.documentElement.style.colorScheme = theme;
}

function cycleTheme(current: string): string {
	if (current === "dark") return "light";
	if (current === "light") return "system";
	return "dark";
}

function getIcon(current: string) {
	if (current === "dark") return "sun";
	if (current === "light") return "moon";
	return "laptop";
}

export default function ThemeToggle() {
	const [mounted, setMounted] = createSignal(false);
	const [theme, setTheme] = createSignal(getStoredTheme());

	onMount(() => {
		setMounted(true);
		const stored = getStoredTheme();
		applyTheme(resolveTheme(stored));

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const listener = () => {
			if (getStoredTheme() === "system") {
				applyTheme(resolveTheme("system"));
			}
		};
		media.addEventListener("change", listener);
	});

	createEffect(() => {
		if (!mounted()) return;
		const t = theme();
		localStorage.setItem(storageKey, t);
		applyTheme(resolveTheme(t));
	});

	const toggle = () => {
		console.log("toggle theme");
		setTheme(cycleTheme(theme()));
	}



	return (
		<button
			onClick={toggle}
			aria-label="Toggle Dark Mode"
			class="rounded-full size-10 p-0 flex items-center justify-center hover:bg-accent transition-colors"
			title="Toggle Theme"
			type="button"
		>
			{!mounted() ? (
				<div class="size-5" />
			) : theme() === "dark" ? (
				<SunIcon class="size-5" />
			) : theme() === "light" ? (
				<MoonIcon class="size-5" />
			) : (
				<LaptopMinimalIcon class="size-5" />
			)}
		</button>
	);
}
