import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-solid";
import { createSignal, onCleanup, onMount } from "solid-js";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function getStored(): Theme {
	try {
		return (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
	} catch {
		return "system";
	}
}

function getSystem(): "light" | "dark" {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolve(t: Theme): "light" | "dark" {
	return t === "system" ? getSystem() : t;
}

function apply(r: "light" | "dark") {
	document.documentElement.setAttribute("data-theme", r);
	document.documentElement.style.colorScheme = r;
}

function cycleTheme(current: Theme): Theme {
	if (current === "dark") return "light";
	if (current === "light") return "system";
	return "dark";
}

export default function ThemeToggle() {
	const [theme, setTheme] = createSignal<Theme>(getStored());
	const [resolved, setResolved] = createSignal<"light" | "dark">();
	const [mounted, setMounted] = createSignal(false);

	onMount(() => {
		const current = getStored();
		const r = resolve(current);

		setTheme(current);
		setResolved(r);
		apply(r);
		setMounted(true);

		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (getStored() === "system") {
				const r = getSystem();
				setResolved(r);
				apply(r);
			}
		};
		media.addEventListener("change", handler);
		onCleanup(() => media.removeEventListener("change", handler));
	});

	const toggle = () => {
		const next = cycleTheme(theme());
		setTheme(next);
		setResolved(resolve(next));
		localStorage.setItem(STORAGE_KEY, next);
		apply(resolve(next));
	};

	return (
		<button
			onClick={toggle}
			aria-label={`Switch theme (current: ${resolved()})`}
			class="rounded-full size-10 p-0 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
			title={`Theme: ${theme()} (${resolved()})`}
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
