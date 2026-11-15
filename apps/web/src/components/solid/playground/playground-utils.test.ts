import { describe, expect, it } from "vitest";
import {
	buildLiveCodesConfig,
	formatConsoleValue,
	normalizeLiveCodesImports,
	resolveEntry,
	getLiveCodesMarkupLanguage,
	getLiveCodesScriptLanguage,
	getLiveCodesStyleLanguage,
	type PlaygroundFile,
} from "./playground-utils";

function file(name: string, content = ""): PlaygroundFile {
	return { name, content };
}

describe("playground file resolution", () => {
	it("accepts equivalent leading-slash and Windows-style entry paths", () => {
		const files = [file("src\\index.tsx"), file("index.html")];

		expect(resolveEntry(files, "/src/index.tsx")).toBe("src\\index.tsx");
		expect(resolveEntry(files, "src/index.tsx")).toBe("src\\index.tsx");
	});

	it("prefers HTML, then script, then the first file", () => {
		expect(resolveEntry([file("readme.md"), file("main.ts")])).toBe("main.ts");
		expect(resolveEntry([file("readme.md"), file("index.html"), file("main.ts")])).toBe(
			"index.html",
		);
		expect(resolveEntry([file("readme.md")], "missing.ts")).toBe("readme.md");
	});
});

describe("LiveCodes configuration", () => {
	it("maps supported source extensions to LiveCodes languages", () => {
		expect(getLiveCodesMarkupLanguage("readme.md")).toBe("markdown");
		expect(getLiveCodesMarkupLanguage("page.mdx")).toBe("mdx");
		expect(getLiveCodesStyleLanguage("theme.scss")).toBe("scss");
		expect(getLiveCodesStyleLanguage("theme.sass")).toBe("sass");
		expect(getLiveCodesStyleLanguage("theme.less")).toBe("less");
		expect(getLiveCodesScriptLanguage("main.jsx")).toBe("react");
		expect(getLiveCodesScriptLanguage("main.tsx")).toBe("react-tsx");
		expect(getLiveCodesScriptLanguage("main.ts")).toBe("typescript");
	});

	it("maps file tabs to the three LiveCodes editors", () => {
		const config = buildLiveCodesConfig(
			[
				file("index.html", "<main />"),
				file("main.tsx", "export default () => null"),
				file("theme.scss", "body { color: red; }"),
			],
			"index.html",
			"theme.scss",
		);

		expect(config.activeEditor).toBe("style");
		expect(config.markup?.content).toBe("<main />");
		expect(config.script?.language).toBe("react-tsx");
		expect(config.style?.language).toBe("scss");
	});

	it("uses fallback markup and enables CSS modules", () => {
		const config = buildLiveCodesConfig([
			file("main.tsx", "import styles from './App.module.css'"),
			file("App.module.css", ".root { color: red; }"),
		]);

		expect(config.markup?.content).toBe('<div id="root"></div>');
		expect(config.processors).toEqual(["cssmodules"]);
		expect(config.script?.content).toContain("./style.module.css");
	});
});

describe("CSS import adapter", () => {
	it("normalizes local imports and leaves external imports untouched", () => {
		const cssFiles = [file("styles/theme.css"), file("App.module.scss")];
		const source =
			'import \'../styles/theme.css\';\nimport "./App.module.scss";\nimport "https://example.com/theme.css";';

		const normalized = normalizeLiveCodesImports(source, cssFiles, cssFiles[0]);

		expect(normalized).toContain("'./style.css'");
		expect(normalized).toContain('"./style.module.css"');
		expect(normalized).toContain('"https://example.com/theme.css"');
	});
});

describe("console formatting", () => {
	it("formats primitives and special values", () => {
		expect(formatConsoleValue("hello")).toBe("hello");
		expect(formatConsoleValue(undefined)).toBe("undefined");
		expect(formatConsoleValue(12n)).toBe("12");
		expect(formatConsoleValue(Symbol("token"))).toBe("Symbol(token)");
		expect(formatConsoleValue(() => "value")).toContain("value");
	});

	it("does not throw for errors and circular objects", () => {
		expect(formatConsoleValue(new Error("boom"))).toContain("boom");

		const circular: Record<string, unknown> = {};
		circular.self = circular;
		expect(formatConsoleValue(circular)).toBe("[object Object]");
	});
});
