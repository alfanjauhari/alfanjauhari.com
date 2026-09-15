import LiveCodes, { type Playground as LiveCodesPlayground } from "livecodes/solid";
import { CodeXmlIcon, EyeIcon, RotateCcwIcon, TerminalIcon } from "lucide-solid";
import { init } from "modern-monaco";
import type * as Monaco from "modern-monaco/editor-core";
import { type Component, createSignal, For, onCleanup, onMount } from "solid-js";
import { cn } from "@/lib/utils";
import {
	buildLiveCodesConfig,
	formatConsoleValue,
	getFileByName,
	getLanguage,
	playgroundPath,
	resolveEntry,
	type PlaygroundFile,
} from "./playground-utils";
import { createLiveCodesRuntime, type LiveCodesRuntime } from "./playground-runtime";

export type { PlaygroundFile } from "./playground-utils";

// #region Public types
type ViewMode = "editor" | "split" | "preview" | "console";

interface ConsoleLog {
	id: string;
	method: string;
	data: unknown[];
}

interface PlaygroundProps {
	files?: PlaygroundFile[];
	entryFile?: string;
}

type MonacoInstance = typeof Monaco;
type MonacoEditor = Monaco.editor.IStandaloneCodeEditor;
type MonacoModel = Monaco.editor.ITextModel;
// #endregion

// #region Monaco helpers
function createModelUri(monaco: MonacoInstance, playgroundId: string, name: string): Monaco.Uri {
	return monaco.Uri.parse(`file:///${playgroundId}${playgroundPath(name)}`);
}

function defineMonacoThemes(monaco: MonacoInstance): void {
	const latte = {
		base: "vs" as const,
		inherit: true,
		rules: [] as {
			token: string;
			foreground?: string;
			fontStyle?: string;
		}[],
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
		rules: [] as {
			token: string;
			foreground?: string;
			fontStyle?: string;
		}[],
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

	monaco.editor.defineTheme("catppuccin-latte", latte);
	monaco.editor.defineTheme("catppuccin-mocha", mocha);
}
// #endregion

export const Playground: Component<PlaygroundProps> = (props) => {
	// #region Component identity and initial inputs
	const playgroundId = `playground-${crypto.randomUUID()}`;
	const initialFiles = props.files ?? [];
	let resolvedEntry = resolveEntry(initialFiles, props.entryFile);
	// #endregion

	// #region Active file state
	const [activeFile, setActiveFile] = createSignal(resolvedEntry);
	// #endregion

	// #region File state
	const [files, setFiles] = createSignal<PlaygroundFile[]>(initialFiles);
	// #endregion

	// #region View state
	const [viewMode, setViewMode] = createSignal<ViewMode>("split");
	// #endregion

	// #region Preview and console state
	const [previewHtml, setPreviewHtml] = createSignal("");
	const [consoleLogs, setConsoleLogs] = createSignal<ConsoleLog[]>([]);
	const [sandboxError, setSandboxError] = createSignal<string>();
	// #endregion

	// #region Readiness state
	const [editorReady, setEditorReady] = createSignal(false);
	// #endregion

	// #region DOM refs
	let playgroundContainer!: HTMLDivElement;
	let editorContainer!: HTMLDivElement;
	let previewFrame!: HTMLIFrameElement;
	// #endregion

	// #region Monaco refs and models
	let monacoInstance: MonacoInstance | undefined;
	let monacoEditor: MonacoEditor | undefined;
	let editorContentSubscription: Monaco.IDisposable | undefined;
	const models = new Map<string, MonacoModel>();
	// #endregion

	// #region LiveCodes refs and subscriptions
	let liveCodesRuntime: LiveCodesRuntime | undefined;
	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let disposed = false;
	let consoleLogId = 0;
	// #endregion

	// #region Theme refs
	let themeObserver: MutationObserver | undefined;
	let mediaQuery: MediaQueryList | undefined;
	let mediaQueryHandler: (() => void) | undefined;
	// #endregion

	// #region Monaco theme functions
	function getMonacoTheme(): string {
		const attr = document.documentElement.getAttribute("data-theme");
		if (attr === "dark") return "catppuccin-mocha";
		if (attr === "light") return "catppuccin-latte";
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "catppuccin-mocha"
			: "catppuccin-latte";
	}

	function applyMonacoTheme(): void {
		if (!monacoEditor || !monacoInstance) return;

		const theme = getMonacoTheme();
		monacoInstance.editor.setTheme(theme);
		monacoEditor.updateOptions({ theme });
	}
	// #endregion

	// #region Console functions
	function appendConsoleLog(method: string, data: unknown[]): void {
		if (method === "clear") {
			setConsoleLogs([]);
			return;
		}

		setConsoleLogs((logs) => [
			...logs,
			{
				id: `console-${consoleLogId++}`,
				method,
				data,
			},
		]);
	}

	function getConsoleMethodClass(method: string): string {
		switch (method) {
			case "error":
				return "text-destructive";
			case "warn":
				return "text-yellow-600 dark:text-yellow-400";
			case "info":
				return "text-blue-600 dark:text-blue-400";
			default:
				return "text-muted-foreground";
		}
	}
	// #endregion

	// #region LiveCodes readiness
	function handleLiveCodesReady(sdk: LiveCodesPlayground): void {
		if (disposed) {
			sdk.destroy().catch(() => {});
			return;
		}

		liveCodesRuntime = createLiveCodesRuntime(sdk, {
			onCode: (result) => setPreviewHtml(result),
			onConsole: appendConsoleLog,
		});

		if (editorReady()) updateLiveCodes();
	}
	// #endregion

	// #region LiveCodes synchronization
	/**
	 * Pushes the current file snapshot into LiveCodes after a short pause.
	 * Monaco state is updated immediately; only compilation is debounced so
	 * typing remains responsive while LiveCodes avoids redundant builds.
	 */
	async function updateLiveCodes(): Promise<void> {
		const runtime = liveCodesRuntime;
		if (disposed || !runtime || !files().length) return;

		try {
			setSandboxError(undefined);
			const code = await runtime.sync(buildLiveCodesConfig(files(), resolvedEntry, activeFile()));
			if (!disposed && runtime === liveCodesRuntime) {
				setPreviewHtml(code.result);
			}
		} catch (error) {
			if (!disposed && runtime === liveCodesRuntime) {
				setSandboxError(
					error instanceof Error ? error.message : "Unable to update the playground.",
				);
			}
		}
	}

	function clearDebouncedUpdate(): void {
		if (!debounceTimer) return;

		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}

	function scheduleLiveCodesUpdate(): void {
		clearDebouncedUpdate();
		debounceTimer = setTimeout(() => {
			debounceTimer = undefined;
			updateLiveCodes();
		}, 500);
	}
	// #endregion

	// #region Monaco model functions
	function createModel(name: string, content: string): MonacoModel {
		if (!monacoInstance) {
			throw new Error("Monaco is not initialized.");
		}

		const model = monacoInstance.editor.createModel(
			content,
			getLanguage(name),
			createModelUri(monacoInstance, playgroundId, name),
		);
		models.set(name, model);
		return model;
	}

	function updateActiveFileFromModel(): void {
		const name = activeFile();
		const model = models.get(name);
		if (!model) return;

		const content = model.getValue();
		setFiles((currentFiles) =>
			currentFiles.map((file) =>
				file.name === name && file.content !== content ? { ...file, content } : file,
			),
		);
		scheduleLiveCodesUpdate();
	}

	function handleEditorContentChange(): void {
		updateActiveFileFromModel();
	}
	// #endregion

	// #region File switching
	/**
	 * Switches Monaco models instead of copying content through LiveCodes.
	 * Each authored file keeps its own model, while LiveCodes only receives the
	 * active file snapshot when compilation is scheduled.
	 */
	function switchFile(name: string): void {
		if (name === activeFile() || !monacoEditor) return;

		const file = getFileByName(files(), name);
		if (!file) return;

		const model = models.get(name) ?? createModel(name, file.content);
		monacoEditor.setModel(model);
		setActiveFile(name);
		requestAnimationFrame(() => monacoEditor?.layout());
	}
	// #endregion

	// #region Refresh
	async function refreshPreview(): Promise<void> {
		clearDebouncedUpdate();
		setConsoleLogs([]);

		const runtime = liveCodesRuntime;
		if (!runtime) return;

		try {
			setSandboxError(undefined);
			const code = await runtime.run();
			if (!disposed && runtime === liveCodesRuntime) {
				setPreviewHtml(code.result);
			}
		} catch (error) {
			if (!disposed && runtime === liveCodesRuntime) {
				setSandboxError(
					error instanceof Error ? error.message : "Unable to refresh the playground.",
				);
			}
		}
	}
	// #endregion

	// #region View helpers
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
	// #endregion

	// #region MDX extraction
	function decodeHtmlEntities(value: string): string {
		const textarea = document.createElement("textarea");
		textarea.innerHTML = value;
		return textarea.value;
	}

	function extractMdxFiles(root: Element): PlaygroundFile[] {
		const templates = root.querySelectorAll<HTMLTemplateElement>("template[data-playground-file]");
		const result: PlaygroundFile[] = [];

		for (const template of templates) {
			const name = template.dataset.playgroundFile ?? "file";
			const content = decodeHtmlEntities(template.content.textContent ?? "");
			result.push({ name, content });
		}

		return result;
	}
	// #endregion

	// #region Initialization
	/**
	 * Initializes the two deliberately separate clients: Monaco presents the
	 * file-tab UX, while LiveCodes compiles the three logical runtime inputs.
	 * Either client may become ready first, so initialization checks both sides
	 * before scheduling the first synchronization.
	 */
	async function initialize(): Promise<void> {
		let currentFiles = files();
		if (!props.files?.length) {
			const root = playgroundContainer.closest("[data-playground-root]");
			currentFiles = root ? extractMdxFiles(root) : [];
			setFiles(currentFiles);
		}

		if (!currentFiles.length) return;

		resolvedEntry = resolveEntry(currentFiles, props.entryFile);
		setActiveFile(resolvedEntry);
		monacoInstance = await init();
		if (disposed || !monacoInstance) return;

		defineMonacoThemes(monacoInstance);
		monacoEditor = monacoInstance.editor.create(editorContainer, {
			automaticLayout: true,
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			fontSize: 14,
			lineNumbers: "on",
			tabSize: 2,
			wordWrap: "on",
			fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
		});

		const firstFile = getFileByName(currentFiles, resolvedEntry);
		if (firstFile) {
			monacoEditor.setModel(createModel(firstFile.name, firstFile.content));
		}

		editorContentSubscription = monacoEditor.onDidChangeModelContent(handleEditorContentChange);
		setEditorReady(true);
		applyMonacoTheme();

		themeObserver = new MutationObserver(applyMonacoTheme);
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQueryHandler = applyMonacoTheme;
		mediaQuery.addEventListener("change", mediaQueryHandler);

		if (liveCodesRuntime) updateLiveCodes();
	}
	// #endregion

	// #region Disposal
	/**
	 * Disposes subscriptions, Monaco models, and the headless LiveCodes
	 * instance together. This prevents delayed compiler or iframe events from
	 * updating a detached playground after Astro removes the component.
	 */
	async function disposePlayground(): Promise<void> {
		const runtime = liveCodesRuntime;
		liveCodesRuntime = undefined;

		try {
			await runtime?.destroy();
		} catch {
			// Cleanup should remain best-effort when the iframe is already gone.
		}

		editorContentSubscription?.dispose();
		editorContentSubscription = undefined;
		monacoEditor?.dispose();
		monacoEditor = undefined;
		setEditorReady(false);

		for (const model of models.values()) model.dispose();
		models.clear();
		previewFrame.srcdoc = "";
	}
	// #endregion

	// #region Solid lifecycle
	onMount(() => {
		initialize().catch((error: unknown) => {
			if (!disposed) {
				setSandboxError(error instanceof Error ? error.message : "Unable to load the playground.");
			}
		});
	});

	onCleanup(() => {
		disposed = true;
		clearDebouncedUpdate();
		themeObserver?.disconnect();
		if (mediaQuery && mediaQueryHandler) {
			mediaQuery.removeEventListener("change", mediaQueryHandler);
		}
		disposePlayground();
	});
	// #endregion

	// #region Render
	return (
		<div
			ref={playgroundContainer}
			class="not-prose my-8 overflow-hidden rounded-lg border border-border"
		>
			<LiveCodes class="hidden" headless loading="eager" sdkReady={handleLiveCodesReady} />

			<div class="flex items-center justify-between border-b border-border bg-secondary/30 px-3 py-1.5">
				<div class="flex items-center gap-0.5 overflow-x-auto">
					<For each={files()}>
						{(file) => (
							<button
								type="button"
								class={cn(
									"shrink-0 cursor-pointer rounded-sm px-3 py-1 font-mono text-xs transition-colors",
									activeFile() === file.name
										? "bg-background text-foreground"
										: "text-foreground/50 hover:bg-secondary/50 hover:text-foreground",
								)}
								onClick={() => switchFile(file.name)}
							>
								{file.name}
							</button>
						)}
					</For>
				</div>

				<div class="ml-2 flex shrink-0 items-center gap-1">
					<div class="ml-1 flex items-center border-l border-border pl-1">
						<button
							type="button"
							class={cn(
								"cursor-pointer rounded p-1 transition-colors",
								viewMode() === "editor"
									? "bg-secondary/50 text-foreground"
									: "text-foreground/50 hover:text-foreground",
							)}
							onClick={() => setViewMode("editor")}
							aria-pressed={viewMode() === "editor"}
							title="Editor only"
						>
							<CodeXmlIcon class="size-3.5" />
						</button>
						<button
							type="button"
							class={cn(
								"cursor-pointer rounded p-1 transition-colors",
								viewMode() === "split"
									? "bg-secondary/50 text-foreground"
									: "text-foreground/50 hover:text-foreground",
							)}
							onClick={() => setViewMode("split")}
							aria-pressed={viewMode() === "split"}
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
							class={cn(
								"cursor-pointer rounded p-1 transition-colors",
								viewMode() === "preview"
									? "bg-secondary/50 text-foreground"
									: "text-foreground/50 hover:text-foreground",
							)}
							onClick={() => setViewMode("preview")}
							aria-pressed={viewMode() === "preview"}
							title="Preview only"
						>
							<EyeIcon class="size-3.5" />
						</button>
						<button
							type="button"
							class={cn(
								"cursor-pointer rounded p-1 transition-colors",
								viewMode() === "console"
									? "bg-secondary/50 text-foreground"
									: "text-foreground/50 hover:text-foreground",
							)}
							onClick={() => setViewMode("console")}
							aria-pressed={viewMode() === "console"}
							title="Console"
						>
							<TerminalIcon class="size-3.5" />
						</button>
					</div>

					<button
						type="button"
						class="cursor-pointer rounded p-1 text-foreground/50 transition-colors hover:text-foreground"
						onClick={() => refreshPreview()}
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

				<div class={cn(getOutputClass(), "border-border bg-background text-foreground min-h-80")}>
					<div class={cn(viewMode() === "console" ? "hidden" : "h-full", "min-h-80")}>
						<iframe
							ref={previewFrame}
							class="h-full min-h-80 w-full border-none"
							title="Playground preview"
							sandbox="allow-downloads allow-forms allow-modals allow-popups allow-presentation allow-scripts"
							srcdoc={previewHtml()}
						/>
					</div>
					<div
						class={cn(
							viewMode() === "console"
								? "h-full max-h-128 overflow-auto bg-background p-3"
								: "hidden",
							"min-h-80",
						)}
					>
						{sandboxError() ? (
							<div class="rounded border border-destructive/30 bg-destructive/5 p-3 font-mono text-xs text-destructive">
								<p class="mb-1 font-semibold">Playground error</p>
								<p class="wrap-break-word whitespace-pre-wrap">{sandboxError()}</p>
							</div>
						) : (
							<For
								each={consoleLogs()}
								fallback={<p class="font-mono text-xs text-muted-foreground">Console is empty.</p>}
							>
								{(log) => (
									<div class="mb-1 flex gap-2 font-mono text-xs text-foreground">
										<span class={cn("shrink-0", getConsoleMethodClass(log.method))}>
											{log.method}
										</span>
										<span class="wrap-break-word whitespace-pre-wrap">
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
						)}
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
};
