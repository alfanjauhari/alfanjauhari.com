import { actions } from "astro:actions";
import { createSignal, Show, type JSX } from "solid-js";
import { cn } from "../../../lib/utils";

export function UserGreeting(props: { name: string }) {
	const [name, setName] = createSignal(props.name);
	const [status, setStatus] = createSignal<{ type: "error" | "success"; text: string }>();

	const save = async (value: string) => {
		const trimmed = value.trim();

		if (!trimmed) {
			setStatus({ type: "error", text: "Name is required" });
			return;
		}

		if (trimmed === props.name) {
			return;
		}

		const fd = new FormData();
		fd.append("name", trimmed);

		const { error } = await actions.updateUserName(fd);

		if (error) {
			setStatus({ type: "error", text: error.message });
			return;
		}

		setName(trimmed);
		setStatus({ type: "success", text: "Name updated successfully" });
	};

	const onBlur: JSX.EventHandler<HTMLSpanElement, FocusEvent> = (event) => {
		save(event.currentTarget.textContent ?? "");
	};

	const onKeyDown: JSX.EventHandler<HTMLSpanElement, KeyboardEvent> = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			event.currentTarget.blur();
		}
	};

	return (
		<>
			<h1 class="font-serif text-5xl mb-4">
				Hello,{" "}
				<span
					contentEditable="plaintext-only"
					spellcheck={false}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					class="underline focus:outline-none"
				>
					{name() || "John Doe"}
				</span>
				!
			</h1>
			<Show when={status()}>
				<p
					class={cn(
						"font-mono text-xs",
						status()?.type === "error" ? "text-destructive" : "text-foreground/50"
					)}
				>
					{status()?.text}
				</p>
			</Show>
		</>
	);
}
