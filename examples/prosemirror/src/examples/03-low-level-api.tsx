import {
	createEditor,
	defaultTools,
	type RichTextTool,
} from "@alfanjauhari/solid-prosemirror/core";
import { createSignal, onCleanup, onMount } from "solid-js";
import type { EditorView } from "prosemirror-view";

export function LowLevelEditor() {
	let editorElement: HTMLDivElement | undefined;
	let view: EditorView | undefined;
	const initialHtml = "<p>Build your own editor chrome.</p>";
	const [html, setHtml] = createSignal(initialHtml);
	const [activeIds, setActiveIds] = createSignal<Set<string>>(new Set());

	onMount(() => {
		if (!editorElement) return;

		view = createEditor(editorElement, initialHtml, {
			tools: defaultTools,
			onChange: (value) => setHtml(value),
			onActiveChange: (ids) => setActiveIds(ids),
		});
	});

	onCleanup(() => view?.destroy());

	const runTool = (tool: RichTextTool) => {
		if (!view) return;

		tool.run(view);
		view.focus();
	};

	return (
		<section class="overflow-hidden rounded-md border border-input">
			<nav class="flex gap-1 border-b border-input p-2" aria-label="Formatting tools">
				{defaultTools.map((tool) => {
					const Icon = tool.icon;

					return (
						<button
							type="button"
							title={tool.title}
							aria-label={tool.title}
							aria-pressed={activeIds().has(tool.id)}
							onMouseDown={(event) => event.preventDefault()}
							onClick={() => runTool(tool)}
							class="rounded px-2 py-1 hover:bg-muted"
						>
							<Icon class="size-4" />
						</button>
					);
				})}
			</nav>
			<div ref={editorElement} class="prose prose-sm max-w-none p-4" />
			<pre class="border-t border-input bg-muted p-4 text-sm">{html()}</pre>
		</section>
	);
}
