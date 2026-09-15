import type { Config, Language } from "livecodes";

// #region Public types
export interface PlaygroundFile {
	name: string;
	content: string;
}

export type LiveCodesEditor = "markup" | "style" | "script";
// #endregion

// #region Constants
const LANG_MAP: Record<string, string> = {
	html: "html",
	css: "css",
	scss: "scss",
	sass: "scss",
	less: "less",
	js: "javascript",
	jsx: "javascript",
	mjs: "javascript",
	cjs: "javascript",
	ts: "typescript",
	tsx: "typescript",
	json: "json",
	md: "markdown",
};

const HTML_EXTENSIONS = [".html", ".htm"];
const MARKUP_EXTENSIONS = [".html", ".htm", ".md", ".mdx"];
const SCRIPT_EXTENSIONS = [".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"];
const CSS_EXTENSIONS = [".css", ".scss", ".sass", ".less"];
const CSS_MODULE_PATTERN = /\.module\.(?:css|scss|sass|less)$/i;
const CSS_IMPORT_PATTERN = /(["'])(\.{1,2}\/[^"']+\.(?:css|scss|sass|less))\1/g;
// #endregion

// #region File helpers
export function getExtension(filename: string): string {
	const lastDot = filename.lastIndexOf(".");
	return lastDot === -1 ? "" : filename.slice(lastDot).toLowerCase();
}

export function getLanguage(filename: string): string {
	const extension = getExtension(filename).slice(1);
	return LANG_MAP[extension] ?? "plaintext";
}

export function getLiveCodesMarkupLanguage(filename: string): Language {
	switch (getExtension(filename)) {
		case ".md":
			return "markdown";
		case ".mdx":
			return "mdx";
		default:
			return "html";
	}
}

export function getLiveCodesStyleLanguage(filename: string): Language {
	switch (getExtension(filename)) {
		case ".scss":
			return "scss";
		case ".sass":
			return "sass";
		case ".less":
			return "less";
		default:
			return "css";
	}
}

export function getLiveCodesScriptLanguage(filename: string): Language {
	switch (getExtension(filename)) {
		case ".jsx":
			return "react";
		case ".tsx":
			return "react-tsx";
		case ".ts":
			return "typescript";
		default:
			return "javascript";
	}
}

export function hasExtension(name: string, extensions: string[]): boolean {
	return extensions.includes(getExtension(name));
}

export function playgroundPath(name: string): string {
	const normalized = name.trim().replaceAll("\\", "/");
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function getFileByName(files: PlaygroundFile[], name?: string): PlaygroundFile | undefined {
	if (!name) return undefined;
	const requestedPath = playgroundPath(name);
	return files.find((file) => playgroundPath(file.name) === requestedPath);
}

export function getDefaultEntry(files: PlaygroundFile[]): string {
	const entry =
		files.find((file) => hasExtension(file.name, HTML_EXTENSIONS)) ??
		files.find((file) => hasExtension(file.name, SCRIPT_EXTENSIONS)) ??
		files[0];
	return entry?.name ?? "index.html";
}

export function resolveEntry(files: PlaygroundFile[], entryFile?: string): string {
	return getFileByName(files, entryFile)?.name ?? getDefaultEntry(files);
}

export function isCssModule(filename: string): boolean {
	return CSS_MODULE_PATTERN.test(filename);
}

export function getLiveCodesEditor(filename: string): LiveCodesEditor {
	if (hasExtension(filename, CSS_EXTENSIONS)) return "style";
	if (hasExtension(filename, SCRIPT_EXTENSIONS)) return "script";
	return "markup";
}

export function getCssFiles(files: PlaygroundFile[]): PlaygroundFile[] {
	return files.filter((file) => hasExtension(file.name, CSS_EXTENSIONS));
}
// #endregion

// #region CSS import adapter
function cssFileMatchesImport(file: PlaygroundFile, importPath: string): boolean {
	const importedName = importPath.replace(/^(?:\.\.?\/)+/, "");
	const fileName = file.name.replaceAll("\\", "/").replace(/^\/+/, "");
	return importedName === fileName || fileName.endsWith("/" + importedName);
}

/**
 * LiveCodes has one style editor, while the outer playground can expose
 * multiple CSS files. Local imports are mapped to LiveCodes' synthetic style
 * filename so the runtime can resolve them without changing authored files.
 */
export function normalizeLiveCodesImports(
	code: string,
	cssFiles: PlaygroundFile[],
	primaryCssFile?: PlaygroundFile,
): string {
	if (!cssFiles.length) return code;

	const extension = getExtension(primaryCssFile?.name ?? "style.css") || ".css";
	return code.replace(CSS_IMPORT_PATTERN, (match: string, quote: string, importPath: string) => {
		if (!cssFiles.some((file) => cssFileMatchesImport(file, importPath))) {
			return match;
		}

		const moduleSuffix = isCssModule(importPath) ? ".module" : "";
		return `${quote}./style${moduleSuffix}${extension}${quote}`;
	});
}

// #endregion

// #region LiveCodes configuration
/**
 * Builds the three logical LiveCodes inputs from the file-tab model.
 * LiveCodes owns compilation and execution; this adapter only selects the
 * source files and combines the style inputs required by the existing UX.
 */
export function buildLiveCodesConfig(
	files: PlaygroundFile[],
	entryFile?: string,
	activeFile?: string,
): Partial<Config> {
	const sourceEntry = resolveEntry(files, entryFile);
	const selectedFile = activeFile ?? sourceEntry;
	const markupFile =
		(hasExtension(sourceEntry, MARKUP_EXTENSIONS)
			? getFileByName(files, sourceEntry)
			: undefined) ??
		files.find((file) => hasExtension(file.name, HTML_EXTENSIONS)) ??
		files.find((file) => hasExtension(file.name, [".md", ".mdx"]));
	const scriptFile =
		(hasExtension(sourceEntry, SCRIPT_EXTENSIONS)
			? getFileByName(files, sourceEntry)
			: undefined) ?? files.find((file) => hasExtension(file.name, SCRIPT_EXTENSIONS));
	const cssFiles = getCssFiles(files);
	const primaryCssFile = cssFiles[0];
	const scriptContent = scriptFile
		? normalizeLiveCodesImports(scriptFile.content, cssFiles, primaryCssFile)
		: "";
	const hasCssModules =
		cssFiles.some((file) => isCssModule(file.name)) || CSS_MODULE_PATTERN.test(scriptContent);

	return {
		autoupdate: true,
		delay: 500,
		title: "Playground",
		htmlAttrs: 'lang="en"',
		activeEditor: getLiveCodesEditor(selectedFile),
		markup: {
			language: markupFile ? getLiveCodesMarkupLanguage(markupFile.name) : "html",
			content: markupFile?.content ?? '<div id="root"></div>',
		},
		style: {
			language: primaryCssFile ? getLiveCodesStyleLanguage(primaryCssFile.name) : "css",
			content: cssFiles.map((file) => file.content).join("\n\n"),
		},
		script: {
			language: scriptFile ? getLiveCodesScriptLanguage(scriptFile.name) : "javascript",
			content: scriptContent,
		},
		processors: hasCssModules ? ["cssmodules"] : [],
	};
}

// #endregion

// #region Console formatting
export function formatConsoleValue(value: unknown, depth = 0): string {
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
			return (
				JSON.stringify(
					value,
					(_key, nestedValue) => {
						if (typeof nestedValue === "function") {
							return nestedValue.toString();
						}
						if (typeof nestedValue === "symbol") {
							return nestedValue.toString();
						}
						if (typeof nestedValue === "bigint") {
							return String(nestedValue);
						}
						return nestedValue;
					},
					depth > 0 ? 2 : undefined,
				) ?? String(value)
			);
		} catch {
			return String(value);
		}
	}
	return String(value);
}
// #endregion
