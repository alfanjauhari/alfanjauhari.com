import { createSignal, For, Show } from "solid-js";
import { BasicEditor } from "./examples/01-rich-text-editor";
import { CustomToolbarEditor } from "./examples/02-custom-toolbar";
import { LowLevelEditor } from "./examples/03-low-level-api";

type ExampleId = "rich-text" | "custom-toolbar" | "low-level";

const examples: { id: ExampleId; title: string; description: string }[] = [
	{
		description: "The packaged editor with its default toolbar.",
		id: "rich-text",
		title: "RichTextEditor",
	},
	{
		description: "A filtered toolbar with a custom undo tool.",
		id: "custom-toolbar",
		title: "Custom toolbar",
	},
	{
		description: "Direct control over the editor view and toolbar shell.",
		id: "low-level",
		title: "Low-level API",
	},
];

export function App() {
	const [selected, setSelected] = createSignal<ExampleId>("rich-text");

	return (
		<main class="mx-auto min-h-screen max-w-5xl px-6 py-12 sm:px-10">
			<header class="max-w-2xl">
				<p class="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
					@alfanjauhari/solid-prosemirror
				</p>
				<h1 class="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">Solid editor examples</h1>
				<p class="mt-4 text-lg text-muted-foreground">
					Three client-side implementations, from the packaged component to a custom ProseMirror
					shell.
				</p>
			</header>

			<nav class="mt-10 grid gap-2 sm:grid-cols-3" aria-label="Editor examples">
				<For each={examples}>
					{(example) => (
						<button
							type="button"
							aria-pressed={selected() === example.id}
							onClick={() => setSelected(example.id)}
							class="rounded-lg border border-input p-4 text-left transition-colors hover:bg-muted aria-pressed:border-foreground aria-pressed:bg-muted"
						>
							<span class="font-medium">{example.title}</span>
							<span class="mt-1 block text-sm text-muted-foreground">{example.description}</span>
						</button>
					)}
				</For>
			</nav>

			<section class="mt-8" aria-live="polite">
				<Show when={selected() === "rich-text"}>
					<BasicEditor />
				</Show>
				<Show when={selected() === "custom-toolbar"}>
					<CustomToolbarEditor />
				</Show>
				<Show when={selected() === "low-level"}>
					<LowLevelEditor />
				</Show>
			</section>
		</main>
	);
}
