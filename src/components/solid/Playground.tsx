import type {
	Dependencies,
	SandboxSetup,
	SandpackBundlerFiles,
	SandpackClient,
	UnsubscribeFunction,
} from "@codesandbox/sandpack-client";
import { loadSandpackClient } from "@codesandbox/sandpack-client";
import {
	CodeXmlIcon,
	EyeIcon,
	RotateCcwIcon,
	TerminalIcon,
} from "lucide-solid";
import { init } from "modern-monaco";
import type * as Monaco from "modern-monaco/editor-core";
import {
	type Component,
	createSignal,
	For,
	onCleanup,
	onMount,
} from "solid-js";
import { cn } from "@/lib/utils";

export interface PlaygroundFile {
	name: string;
	content: string;
}

const LANG_MAP: Record<string, string> = {
	html: "html",
	css: "css",
	js: "javascript",
	jsx: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	ts: "typescript",
	tsx: "typescript",
	json: "json",
	md: "markdown",
};

function getLanguage(filename: string): string {
	const ext = filename.split(".").pop() ?? "";
	return LANG_MAP[ext] ?? "plaintext";
}

function sandpackPath(name: string): string {
	return name.startsWith("/") ? name : `/${name}`;
}

function hasExtension(name: string, extensions: string[]): boolean {
	return extensions.some((extension) => name.endsWith(extension));
}

function getPreviewEntry(files: PlaygroundFile[], entryFile?: string): string {
	const entry = entryFile ?? files[0]?.name ?? "index.html";
	return hasExtension(entry, [".html", ".htm"])
		? sandpackPath(entry)
		: "/index.html";
}

function getRuntimeEntry(files: PlaygroundFile[], entryFile?: string): string {
	const entry = entryFile ?? files[0]?.name ?? "index.html";
	return sandpackPath(entry);
}

function getGeneratedRuntimeEntry(
	files: PlaygroundFile[],
	entryFile?: string,
): string {
	const runtimeEntry = getRuntimeEntry(files, entryFile);
	return hasExtension(runtimeEntry, [".jsx", ".tsx"])
		? "/index.tsx"
		: runtimeEntry;
}

const CONSOLE_HOOK_INLINE = (playgroundId: string) =>
	`<script>window.__PLAYGROUND_ID__=${JSON.stringify(playgroundId)};(function(){var m=["log","debug","info","warn","error"];for(var i=0;i<m.length;i++){(function(method){var o=console[method];console[method]=function(){try{window.parent.postMessage({source:"playground-console",playgroundId:window.__PLAYGROUND_ID__,log:{method:method,data:Array.prototype.slice.call(arguments)}},"*")}catch(_){window.parent.postMessage({source:"playground-console",playgroundId:window.__PLAYGROUND_ID__,log:{method:method,data:Array.prototype.slice.call(arguments).map(function(a){return(typeof a==="object"&&a!==null?JSON.stringify(a,null,2):String(a))})}},"*")};o.apply(console,arguments)}})(m[i])}})();</script>`;

function buildGeneratedHtml(
	runtimeEntry: string,
	playgroundId: string,
): string {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Playground</title>
    ${CONSOLE_HOOK_INLINE(playgroundId)}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${runtimeEntry}"></script>
  </body>
</html>`;
}

function decodeHtmlEntities(value: string): string {
	const textarea = document.createElement("textarea");
	textarea.innerHTML = value;
	return textarea.value;
}

function buildReactEntry(runtimeEntry: string): string {
	return `import React from "react";
import { createRoot } from "react-dom/client";
import App from "${runtimeEntry}";

createRoot(document.getElementById("root")!).render(<App />);`;
}

function injectConsoleHook(html: string, playgroundId: string): string {
	if (html.includes("playground-console")) return html;
	const hook = CONSOLE_HOOK_INLINE(playgroundId);
	return html.includes("</head>")
		? html.replace("</head>", `${hook}\n  </head>`)
		: `${hook}\n${html}`;
}

function getSandboxDependencies(files: PlaygroundFile[]): Dependencies {
	const needsReact = files.some((file) =>
		hasExtension(file.name, [".jsx", ".tsx"]),
	);
	return needsReact ? { react: "latest", "react-dom": "latest" } : {};
}

function createModelUri(
	monaco: MonacoInstance,
	playgroundId: string,
	name: string,
): Monaco.Uri {
	return monaco.Uri.parse(`file:///${playgroundId}${sandpackPath(name)}`);
}

function buildSandboxSetup(
	files: PlaygroundFile[],
	playgroundId: string,
	entryFile?: string,
): SandboxSetup {
	const bundledFiles: SandpackBundlerFiles = {};
	for (const file of files) {
		bundledFiles[sandpackPath(file.name)] = { code: file.content };
	}

	const sourceEntry = getRuntimeEntry(files, entryFile);
	const runtimeEntry = getGeneratedRuntimeEntry(files, entryFile);
	const previewEntry = getPreviewEntry(files, entryFile);
	if (runtimeEntry !== sourceEntry && !bundledFiles[runtimeEntry]) {
		bundledFiles[runtimeEntry] = { code: buildReactEntry(sourceEntry) };
	}
	if (bundledFiles[previewEntry]) {
		bundledFiles[previewEntry].code = injectConsoleHook(
			bundledFiles[previewEntry].code,
			playgroundId,
		);
	} else {
		bundledFiles[previewEntry] = {
			code: buildGeneratedHtml(runtimeEntry, playgroundId),
		};
	}

	return {
		dependencies: getSandboxDependencies(files),
		files: bundledFiles,
		entry: previewEntry,
		template: "parcel",
	};
}

function extractMdxFiles(root: Element): PlaygroundFile[] {
	const templates = root.querySelectorAll<HTMLTemplateElement>(
		"template[data-playground-file]",
	);
	const result: PlaygroundFile[] = [];
	for (const template of templates) {
		const name = template.dataset.playgroundFile ?? "file";
		const content = decodeHtmlEntities(template.content.textContent ?? "");
		result.push({ name, content });
	}
	return result;
}

type MonacoInstance = typeof Monaco;
type MonacoEditor = Monaco.editor.IStandaloneCodeEditor;
type MonacoModel = Monaco.editor.ITextModel;

interface ConsoleLog {
	id: string;
	method: string;
	data: unknown[];
}

function parseMessageData(raw: string): unknown {
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}

function formatConsoleValue(value: unknown, depth = 0): string {
	if (typeof value === "string") return value;
	if (value === undefined) return "undefined";
	if (value === null) return "null";
	if (typeof value === "function") return value.toString();
	if (value instanceof Error) return value.stack ?? value.message;
	if (typeof value === "boolean") return value.toString();
	if (typeof value === "number") return String(value);
	if (typeof value === "bigint") return String(value);
	if (typeof value === "symbol") return value.toString();
	if (typeof value === "object") {
		try {
			return JSON.stringify(
				value,
				(_key, v) => {
					if (typeof v === "function") return v.toString();
					if (typeof v === "symbol") return v.toString();
					if (typeof v === "bigint") return String(v);
					return v;
				},
				depth > 0 ? 2 : undefined,
			);
		} catch {
			return String(value);
		}
	}
	return String(value);
}

interface PlaygroundProps {
	files?: PlaygroundFile[];
	entryFile?: string;
}

export const Playground: Component<PlaygroundProps> = (props) => {
	const playgroundId = `playground-${crypto.randomUUID()}`;
	const initialFiles = props.files ?? [];
	let resolvedEntry = props.entryFile ?? initialFiles[0]?.name ?? "index.html";
	const [activeFile, setActiveFile] = createSignal(resolvedEntry);
	const [files, setFiles] = createSignal<PlaygroundFile[]>(initialFiles);
	const [viewMode, setViewMode] = createSignal<
		"editor" | "split" | "preview" | "console"
	>("split");
	const [consoleLogs, setConsoleLogs] = createSignal<ConsoleLog[]>([]);
	let playgroundContainer!: HTMLDivElement;
	let editorContainer!: HTMLDivElement;
	let previewContainer!: HTMLDivElement;
	let monacoInstance: MonacoInstance;
	let monacoEditor: MonacoEditor;
	let sandpackClient: SandpackClient | undefined;
	let sandpackIframe: HTMLIFrameElement | undefined;
	let unsubscribeSandpack: UnsubscribeFunction | undefined;
	let consoleLogId = 0;
	const models = new Map<string, MonacoModel>();
	let themeObserver: MutationObserver | undefined;
	let mq: MediaQueryList | undefined;
	let mqHandler: (() => void) | undefined;

	function defineMonacoThemes(m: MonacoInstance) {
		const latte = {
			base: "vs" as const,
			inherit: true,
			rules: [] as { token: string; foreground?: string; fontStyle?: string }[],
			colors: {
				"editor.background": "#eff1f5",
				"editor.foreground": "#4c4f69",
				"editorLineNumber.foreground": "#bcc0cc",
				"editorLineNumber.activeForeground": "#4c4f69",
				"editor.selectionBackground": "#ccd0da",
				"editorCursor.foreground": "#1e66f5",
				"editor.inactiveSelectionBackground": "#e6e9ef",
				"editorBracketMatch.background": "#ccd0da",
				"editorBracketMatch.border": "#bcc0cc",
			},
		};
		const mocha = {
			base: "vs-dark" as const,
			inherit: true,
			rules: [] as { token: string; foreground?: string; fontStyle?: string }[],
			colors: {
				"editor.background": "#1e1e2e",
				"editor.foreground": "#cdd6f4",
				"editorLineNumber.foreground": "#585b70",
				"editorLineNumber.activeForeground": "#cdd6f4",
				"editor.selectionBackground": "#313244",
				"editorCursor.foreground": "#89b4fa",
				"editor.inactiveSelectionBackground": "#313244",
				"editorBracketMatch.background": "#313244",
				"editorBracketMatch.border": "#585b70",
			},
		};
		m.editor.defineTheme(
			"catppuccin-latte",
			latte as Parameters<typeof m.editor.defineTheme>[1],
		);
		m.editor.defineTheme(
			"catppuccin-mocha",
			mocha as Parameters<typeof m.editor.defineTheme>[1],
		);
	}

	function getMonacoTheme(): string {
		const attr = document.documentElement.getAttribute("data-theme");
		if (attr === "dark") return "catppuccin-mocha";
		if (attr === "light") return "catppuccin-latte";
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "catppuccin-mocha"
			: "catppuccin-latte";
	}

	function applyMonacoTheme() {
		if (monacoEditor) {
			monacoInstance?.editor.setTheme(getMonacoTheme());
		}
	}

	function dispose() {
		monacoEditor?.dispose();
		for (const model of models.values()) {
			model.dispose();
		}
		models.clear();
	}

	function getFileContent(name: string): string {
		const file = files().find((f) => f.name === name);
		return file?.content ?? "";
	}

	function syncContentFromEditor() {
		if (!monacoEditor) return;
		const name = activeFile();
		const model = models.get(name);
		if (!model) return;
		const content = model.getValue();
		setFiles((currentFiles) =>
			currentFiles.map((file) =>
				file.name === name ? { ...file, content } : file,
			),
		);
	}

	function updateSandpack() {
		if (!sandpackClient) return;
		syncContentFromEditor();
		const setup = buildSandboxSetup(files(), playgroundId, resolvedEntry);
		sandpackClient.updateSandbox(setup);
	}

	let debounceTimer: ReturnType<typeof setTimeout>;
	function debouncedUpdate() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(updateSandpack, 500);
	}

	function switchFile(name: string) {
		if (name === activeFile()) return;
		if (!monacoEditor) return;

		syncContentFromEditor();

		if (!models.has(name)) {
			const content = getFileContent(name);
			const lang = getLanguage(name);
			const model = monacoInstance.editor.createModel(
				content,
				lang,
				createModelUri(monacoInstance, playgroundId, name),
			);
			models.set(name, model);
		}

		const model = models.get(name);
		monacoEditor.setModel(model ?? null);
		setActiveFile(name);
		requestAnimationFrame(() => monacoEditor.layout());
	}

	function refreshPreview() {
		syncContentFromEditor();
		setConsoleLogs([]);
		if (sandpackClient) {
			const setup = buildSandboxSetup(files(), playgroundId, resolvedEntry);
			sandpackClient.updateSandbox(setup);
		}
	}

	function getEditorClass(): string {
		return viewMode() === "preview" || viewMode() === "console"
			? "hidden"
			: viewMode() === "split"
				? "md:w-1/2"
				: "w-full";
	}

	function getOutputClass(): string {
		return viewMode() === "editor"
			? "hidden"
			: viewMode() === "split"
				? "md:w-1/2 border-t md:border-t-0 md:border-l"
				: "w-full border-t";
	}

	function appendConsoleLog(
		method: string,
		data: unknown[],
		fromSandpackClient?: boolean,
	) {
		const processed = fromSandpackClient
			? data.map((item) =>
					typeof item === "string" ? parseMessageData(item) : item,
				)
			: data;

		setConsoleLogs((logs) => [
			...logs,
			{ id: `console-${consoleLogId++}`, method, data: processed },
		]);
	}

	function readSandpackMessage(
		message: Parameters<SandpackClient["listen"]>[0] extends (
			message: infer T,
		) => void
			? T
			: never,
	) {
		if (message.type !== "console") return;
		for (const log of message.log) {
			appendConsoleLog(log.method, log.data, true);
		}
	}

	function readWindowMessage(event: MessageEvent<unknown>) {
		if (event.source !== sandpackIframe?.contentWindow) return;
		const data = event.data as {
			source?: unknown;
			playgroundId?: unknown;
			log?: unknown;
		} | null;
		if (data?.source !== "playground-console") return;
		if (data.playgroundId !== playgroundId) return;
		const log = data.log as { method?: unknown; data?: unknown };
		if (!log || typeof log.method !== "string") return;
		const logData = Array.isArray(log.data) ? log.data : [];
		appendConsoleLog(log.method, logData);
	}

	onMount(async () => {
		if (!props.files?.length) {
			const root = playgroundContainer.closest("[data-playground-root]");
			const extractedFiles = root ? extractMdxFiles(root) : [];
			setFiles(extractedFiles);
			resolvedEntry =
				props.entryFile ?? extractedFiles[0]?.name ?? "index.html";
			setActiveFile(resolvedEntry);
		}

		monacoInstance = await init();

		try {
			// biome-ignore lint/suspicious/noExplicitAny: modern-monaco types don't include languages namespace
			const instance = monacoInstance as any;
			instance.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
				noSemanticValidation: true,
				noSyntaxValidation: false,
			});
			instance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
				noSemanticValidation: true,
				noSyntaxValidation: false,
			});
		} catch {
			// languages.typescript not available in modern-monaco — no diagnostics to suppress
		}

		defineMonacoThemes(monacoInstance);

		monacoEditor = monacoInstance.editor.create(editorContainer, {
			theme: getMonacoTheme(),
			automaticLayout: true,
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			fontSize: 14,
			lineNumbers: "on",
			tabSize: 2,
			wordWrap: "on",
			fontFamily:
				"'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
		});

		const firstFile = files().find((f) => f.name === resolvedEntry);
		if (firstFile) {
			const lang = getLanguage(firstFile.name);
			const model = monacoInstance.editor.createModel(
				firstFile.content,
				lang,
				createModelUri(monacoInstance, playgroundId, firstFile.name),
			);
			models.set(firstFile.name, model);
			monacoEditor.setModel(model);
		}

		monacoEditor.onDidChangeModelContent(() => {
			debouncedUpdate();
		});
		window.addEventListener("message", readWindowMessage);

		sandpackIframe = document.createElement("iframe");
		sandpackIframe.style.width = "100%";
		sandpackIframe.style.height = "100%";
		sandpackIframe.style.border = "none";
		sandpackIframe.style.minHeight = "320px";
		sandpackIframe.src = "about:blank";
		previewContainer.appendChild(sandpackIframe);

		try {
			const setup = buildSandboxSetup(files(), playgroundId, resolvedEntry);
			sandpackClient = await loadSandpackClient(sandpackIframe, setup, {
				clearConsoleOnFirstCompile: false,
				showOpenInCodeSandbox: false,
				showLoadingScreen: true,
			});
			unsubscribeSandpack = sandpackClient.listen(readSandpackMessage);
		} catch (err) {
			console.error("Sandpack client failed to load:", err);
		}

		themeObserver = new MutationObserver(applyMonacoTheme);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		mq = window.matchMedia("(prefers-color-scheme: dark)");
		mqHandler = applyMonacoTheme;
		mq.addEventListener("change", mqHandler);
	});

	onCleanup(() => {
		unsubscribeSandpack?.();
		clearTimeout(debounceTimer);
		window.removeEventListener("message", readWindowMessage);
		themeObserver?.disconnect();
		if (mq && mqHandler) mq.removeEventListener("change", mqHandler);
		dispose();
	});

	return (
		<div
			ref={playgroundContainer}
			class="not-prose my-8 rounded-lg overflow-hidden border border-border"
		>
			<div class="flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-1.5">
				<div class="flex items-center gap-0.5 overflow-x-auto">
					<For each={files()}>
						{(file) => (
							<button
								type="button"
								class={`shrink-0 px-3 py-1 text-xs font-mono rounded-sm cursor-pointer transition-colors ${
									activeFile() === file.name
										? "bg-background text-foreground"
										: "text-foreground/50 hover:text-foreground hover:bg-secondary/50"
								}`}
								onClick={() => switchFile(file.name)}
							>
								{file.name}
							</button>
						)}
					</For>
				</div>

				<div class="flex items-center gap-1 shrink-0 ml-2">
					<div class="flex items-center border-l border-border ml-1 pl-1">
						<button
							type="button"
							class={`p-1 rounded cursor-pointer transition-colors ${
								viewMode() === "editor"
									? "text-foreground bg-secondary/50"
									: "text-foreground/50 hover:text-foreground"
							}`}
							onClick={() => setViewMode("editor")}
							title="Editor only"
						>
							<CodeXmlIcon class="size-3.5" />
						</button>
						<button
							type="button"
							class={`p-1 rounded cursor-pointer transition-colors ${
								viewMode() === "split"
									? "text-foreground bg-secondary/50"
									: "text-foreground/50 hover:text-foreground"
							}`}
							onClick={() => setViewMode("split")}
							title="Split view"
						>
							<svg
								class="size-3.5"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								aria-hidden="true"
							>
								<rect x="0.5" y="1.5" width="6.5" height="13" rx="1" />
								<rect x="9" y="1.5" width="6.5" height="13" rx="1" />
							</svg>
						</button>
						<button
							type="button"
							class={`p-1 rounded cursor-pointer transition-colors ${
								viewMode() === "preview"
									? "text-foreground bg-secondary/50"
									: "text-foreground/50 hover:text-foreground"
							}`}
							onClick={() => setViewMode("preview")}
							title="Preview only"
						>
							<EyeIcon class="size-3.5" />
						</button>
						<button
							type="button"
							class={`p-1 rounded cursor-pointer transition-colors ${
								viewMode() === "console"
									? "text-foreground bg-secondary/50"
									: "text-foreground/50 hover:text-foreground"
							}`}
							onClick={() => setViewMode("console")}
							title="Console"
						>
							<TerminalIcon class="size-3.5" />
						</button>
					</div>

					<button
						type="button"
						class="p-1 rounded text-foreground/50 hover:text-foreground cursor-pointer transition-colors"
						onClick={refreshPreview}
						title="Refresh preview"
					>
						<RotateCcwIcon class="size-3.5" />
					</button>
				</div>
			</div>

			<div class="flex flex-col md:flex-row">
				<div class={cn(getEditorClass(), "min-h-80")}>
					<div ref={editorContainer} class="h-full min-h-80" />
				</div>

				<div
					class={cn(`${getOutputClass()} border-border bg-white`, "min-h-80")}
				>
					<div
						ref={previewContainer}
						class={cn(
							viewMode() === "console" ? "hidden" : "h-full",
							"min-h-80",
						)}
					/>
					<div
						class={cn(
							viewMode() === "console" ? "h-full bg-zinc-950 p-3" : "hidden",
							"min-h-80",
						)}
					>
						<For
							each={consoleLogs()}
							fallback={
								<p class="font-mono text-xs text-zinc-500">Console is empty.</p>
							}
						>
							{(log) => (
								<div class="mb-1 flex gap-2 font-mono text-xs text-zinc-100">
									<span class="shrink-0 text-zinc-500">{log.method}</span>
									<span class="whitespace-pre-wrap wrap-break-word">
										<For each={log.data}>
											{(value, index) => (
												<>
													<span>{formatConsoleValue(value)}</span>
													{index() < log.data.length - 1 ? " " : ""}
												</>
											)}
										</For>
									</span>
								</div>
							)}
						</For>
					</div>
				</div>
			</div>
		</div>
	);
};
