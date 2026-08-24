import { CLOUDFLARE_TURNSTILE_SITE_KEY } from "astro:env/client";
import { onCleanup, onMount } from "solid-js";

interface TurnstileRenderOptions {
	sitekey: string;
	theme?: "light" | "dark" | "auto";
	action?: string;
	callback?: (token: string) => void;
	"error-callback"?: (errorCode: string) => void;
	"expired-callback"?: () => void;
	"timeout-callback"?: () => void;
	tabindex?: number;
}

interface TurnstileAPI {
	render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
	reset: (widgetId?: string) => void;
	remove: (widgetId?: string) => void;
	getResponse: (widgetId?: string) => string | undefined;
	ready?: (callback: () => void) => void;
}

declare global {
	interface Window {
		turnstile?: TurnstileAPI;
	}
}

export function Turnstile(props: { class?: string; registerReset?: (reset: () => void) => void }) {
	let container: HTMLDivElement | undefined;
	let widgetId: string | undefined;

	const renderWidget = () => {
		if (!container || widgetId || !window.turnstile) return;

		widgetId = window.turnstile.render(container, {
			sitekey: CLOUDFLARE_TURNSTILE_SITE_KEY,
			theme: "auto",
		});
	};

	const reset = () => {
		if (widgetId) {
			window.turnstile?.reset(widgetId);
		}
	};

	onMount(() => {
		props.registerReset?.(reset);

		if (window.turnstile) {
			renderWidget();
			return;
		}

		const interval = window.setInterval(() => {
			if (window.turnstile) {
				window.clearInterval(interval);
				renderWidget();
			}
		}, 200);

		onCleanup(() => window.clearInterval(interval));
	});

	onCleanup(() => {
		if (widgetId) {
			window.turnstile?.remove(widgetId);
		}
	});

	return <div ref={container} class={props.class} />;
}
