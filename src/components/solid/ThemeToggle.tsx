import { LaptopMinimalIcon, MoonIcon, SunIcon } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import { useTheme } from "./ThemeContext";

function cycleTheme(current: string): string {
	if (current === "dark") return "light";
	if (current === "light") return "system";
	return "dark";
}

export default function ThemeToggle() {
	const [mounted, setMounted] = createSignal(false);
	const ctx = useTheme();

	onMount(() => {
		setMounted(true);
	});

	const toggle = () => {
		ctx.setTheme(cycleTheme(ctx.theme()));
	};

	return (
		<button
			onClick={toggle}
			aria-label="Toggle Dark Mode"
			class="rounded-full size-10 p-0 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
			title={`Theme: ${ctx.theme()} (${ctx.resolved()})`}
			type="button"
		>
			{!mounted() ? (
				<div class="size-5" />
			) : ctx.theme() === "dark" ? (
				<SunIcon class="size-5" />
			) : ctx.theme() === "light" ? (
				<MoonIcon class="size-5" />
			) : (
				<LaptopMinimalIcon class="size-5" />
			)}
		</button>
	);
}
