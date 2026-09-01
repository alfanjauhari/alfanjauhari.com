import { defaultTools, RichTextEditor, type RichTextTool } from "@alfanjauhari/solid-prosemirror";
import { undo } from "prosemirror-history";
import { Undo2Icon } from "lucide-solid";
import { createSignal } from "solid-js";

const undoTool: RichTextTool = {
	id: "undo",
	title: "Undo",
	icon: Undo2Icon,
	run: (view) => {
		undo(view.state, view.dispatch);
	},
	isActive: () => false,
};

const tools: RichTextTool[] = [
	undoTool,
	...defaultTools.filter((tool) => ["bold", "italic", "blockquote"].includes(tool.id)),
];

export function CustomToolbarEditor() {
	const initialHtml = "<p>Try the smaller toolbar.</p>";
	const [html, setHtml] = createSignal(initialHtml);

	return (
		<section class="grid gap-4">
			<RichTextEditor
				defaultValue={initialHtml}
				onChange={(value) => setHtml(value)}
				tools={tools}
			/>
			<output class="text-sm text-muted-foreground" aria-live="polite">
				{html()}
			</output>
		</section>
	);
}
