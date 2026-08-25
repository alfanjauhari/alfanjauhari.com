import { baseKeymap, lift, toggleMark, wrapIn } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import {
	DOMParser,
	DOMSerializer,
	type MarkType,
	type Node as ProseMirrorNode,
	Schema,
} from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import {
	BoldIcon,
	ItalicIcon,
	StrikethroughIcon,
	TextQuoteIcon,
	UnderlineIcon,
} from "lucide-solid";
import type { Component } from "solid-js";

export const schema = new Schema({
	nodes: {
		doc: { content: "block+" },
		paragraph: {
			content: "inline*",
			group: "block",
			parseDOM: [{ tag: "p" }, { tag: "div" }],
			toDOM: () => ["p", 0],
		},
		blockquote: {
			content: "block+",
			group: "block",
			defining: true,
			parseDOM: [{ tag: "blockquote" }],
			toDOM: () => ["blockquote", 0],
		},
		text: { group: "inline" },
		hard_break: {
			inline: true,
			group: "inline",
			selectable: false,
			parseDOM: [{ tag: "br" }],
			toDOM: () => ["br"],
		},
	},
	marks: {
		strong: {
			parseDOM: [{ tag: "strong" }, { tag: "b" }, { style: "font-weight=bold" }],
			toDOM: () => ["strong", 0],
		},
		em: {
			parseDOM: [{ tag: "em" }, { tag: "i" }, { style: "font-style=italic" }],
			toDOM: () => ["em", 0],
		},
		underline: {
			parseDOM: [{ tag: "u" }, { style: "text-decoration=underline" }],
			toDOM: () => ["u", 0],
		},
		strike: {
			parseDOM: [
				{ tag: "s" },
				{ tag: "strike" },
				{ tag: "del" },
				{ style: "text-decoration=line-through" },
			],
			toDOM: () => ["s", 0],
		},
	},
});

export interface RichTextTool {
	id: string;
	title: string;
	icon: Component<{ class?: string }>;
	run: (view: EditorView) => void;
	isActive: (state: EditorState) => boolean;
}

function isMarkActive(state: EditorState, type: MarkType): boolean {
	const { from, $from, to, empty } = state.selection;

	if (empty) {
		return !!type.isInSet(state.storedMarks ?? $from.marks());
	}

	return state.doc.rangeHasMark(from, to, type);
}

function isBlockquoteActive(state: EditorState): boolean {
	const { $from } = state.selection;

	for (let depth = $from.depth; depth > 0; depth--) {
		if ($from.node(depth).type === schema.nodes.blockquote) {
			return true;
		}
	}

	return false;
}

function toggleBlockquote(view: EditorView) {
	if (isBlockquoteActive(view.state)) {
		lift(view.state, view.dispatch);
		return;
	}

	wrapIn(schema.nodes.blockquote)(view.state, view.dispatch);
}

export const defaultTools: RichTextTool[] = [
	{
		id: "bold",
		title: "Bold",
		icon: BoldIcon,
		run: (view) => toggleMark(schema.marks.strong)(view.state, view.dispatch),
		isActive: (state) => isMarkActive(state, schema.marks.strong),
	},
	{
		id: "italic",
		title: "Italic",
		icon: ItalicIcon,
		run: (view) => toggleMark(schema.marks.em)(view.state, view.dispatch),
		isActive: (state) => isMarkActive(state, schema.marks.em),
	},
	{
		id: "underline",
		title: "Underline",
		icon: UnderlineIcon,
		run: (view) => toggleMark(schema.marks.underline)(view.state, view.dispatch),
		isActive: (state) => isMarkActive(state, schema.marks.underline),
	},
	{
		id: "strikethrough",
		title: "Strikethrough",
		icon: StrikethroughIcon,
		run: (view) => toggleMark(schema.marks.strike)(view.state, view.dispatch),
		isActive: (state) => isMarkActive(state, schema.marks.strike),
	},
	{
		id: "blockquote",
		title: "Blockquote",
		icon: TextQuoteIcon,
		run: toggleBlockquote,
		isActive: isBlockquoteActive,
	},
];

function getActiveIds(state: EditorState, tools: RichTextTool[]): Set<string> {
	const ids = new Set<string>();

	for (const tool of tools) {
		if (tool.isActive(state)) {
			ids.add(tool.id);
		}
	}

	return ids;
}

function htmlToDoc(html: string): ProseMirrorNode {
	const element = document.createElement("div");
	element.innerHTML = html;
	return DOMParser.fromSchema(schema).parse(element);
}

function docToHtml(doc: ProseMirrorNode): string {
	const fragment = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
	const element = document.createElement("div");
	element.appendChild(fragment);
	return element.innerHTML;
}

export interface EditorCallbacks {
	tools: RichTextTool[];
	onChange: (html: string) => void;
	onActiveChange: (ids: Set<string>) => void;
}

function observerPlugin(callbacks: EditorCallbacks): Plugin {
	return new Plugin({
		view() {
			return {
				update(view: EditorView, prevState: EditorState) {
					if (!view.state.doc.eq(prevState.doc)) {
						callbacks.onChange(docToHtml(view.state.doc));
					}

					callbacks.onActiveChange(getActiveIds(view.state, callbacks.tools));
				},
			};
		},
	});
}

export function createEditor(
	element: HTMLElement,
	initialHtml: string | undefined,
	callbacks: EditorCallbacks,
): EditorView {
	const state = EditorState.create({
		schema,
		doc: initialHtml ? htmlToDoc(initialHtml) : undefined,
		plugins: [
			history(),
			keymap(baseKeymap),
			keymap({
				"Mod-b": toggleMark(schema.marks.strong),
				"Mod-i": toggleMark(schema.marks.em),
				"Mod-u": toggleMark(schema.marks.underline),
				"Mod-Shift-x": toggleMark(schema.marks.strike),
			}),
			observerPlugin(callbacks),
		],
	});

	const view = new EditorView(element, { state });

	callbacks.onActiveChange(getActiveIds(view.state, callbacks.tools));

	return view;
}
