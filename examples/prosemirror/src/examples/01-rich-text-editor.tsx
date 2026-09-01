import { RichTextEditor } from "@alfanjauhari/solid-prosemirror";
import { createSignal } from "solid-js";

export function BasicEditor() {
	const initialHtml = "<p>Write something worth sharing.</p>";
	const [html, setHtml] = createSignal(initialHtml);

	return (
		<section class="grid gap-4">
			<RichTextEditor
				defaultValue={initialHtml}
				onChange={(value) => setHtml(value)}
				class="prose-p:text-black"
			/>
			<div>
				<p class="text-sm text-muted-foreground">Serialized HTML</p>
				<pre class="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-sm">{html()}</pre>
			</div>
		</section>
	);
}
