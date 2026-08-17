import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/solid";
import { createSignal, onCleanup, onMount } from "solid-js";
import type { EditorView } from "prosemirror-view";
import { cn } from "@/lib/utils";
import { createEditor, defaultTools, type RichTextTool } from "./editor";
import "prosemirror-view/style/prosemirror.css";

export interface RichTextEditorProps {
	defaultValue?: string;
	onChange?: (html: string) => void;
	tools?: RichTextTool[];
	class?: string;
}

export function RichTextEditor(props: RichTextEditorProps) {
	const tools = () => props.tools ?? defaultTools;
	const [activeIds, setActiveIds] = createSignal<Set<string>>(new Set());

	let editorDom: HTMLDivElement | undefined;
	let view: EditorView | undefined;

	onMount(() => {
		if (!editorDom) return;

		view = createEditor(editorDom, props.defaultValue, {
			tools: tools(),
			onChange: (html) => props.onChange?.(html),
			onActiveChange: (ids) => setActiveIds(ids),
		});
	});

	onCleanup(() => {
		view?.destroy();
	});

	const runTool = (tool: RichTextTool) => {
		if (!view) return;

		tool.run(view);
		view.focus();
	};

	return (
		<ProsemirrorAdapterProvider>
			<div class={cn("border border-input rounded-md overflow-hidden", props.class)}>
				<div class="flex flex-wrap gap-0.5 border-b border-input px-2 py-1.5 bg-muted/30">
					{tools().map((tool) => {
						const Icon = tool.icon;
						return (
							<button
								type="button"
								title={tool.title}
								aria-label={tool.title}
								aria-pressed={activeIds().has(tool.id)}
								onMouseDown={(event) => event.preventDefault()}
								onClick={() => runTool(tool)}
								class={cn(
									"inline-flex items-center justify-center size-8 rounded-md cursor-pointer transition-colors",
									activeIds().has(tool.id)
										? "bg-foreground/10 text-foreground"
										: "text-foreground/50 hover:bg-foreground/5 hover:text-foreground/70"
								)}
							>
								<Icon class="size-4" />
							</button>
						);
					})}
				</div>
				<div
					ref={editorDom}
					class="prose prose-sm dark:prose-invert max-w-none min-h-20 px-3 py-2 *:focus:outline-none"
				/>
			</div>
		</ProsemirrorAdapterProvider>
	);
}
