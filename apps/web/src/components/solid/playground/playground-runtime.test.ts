import { describe, expect, it, vi } from "vitest";
import type { Config, Playground as LiveCodesPlayground } from "livecodes";
import { createLiveCodesRuntime, type LiveCodesRuntimeHandlers } from "./playground-runtime";

type CodeHandler = (event: { code: { result: string } }) => void;
type ConsoleHandler = (event: { method: string; args: unknown[] }) => void;

function createFakeSdk() {
	const codeHandlers: CodeHandler[] = [];
	const consoleHandlers: ConsoleHandler[] = [];
	const removedSubscriptions: string[] = [];
	const setConfig = vi.fn(async (config: Partial<Config>) => config as Config);
	const run = vi.fn(async () => {});
	const getCode = vi.fn(async () => ({
		markup: { language: "html" as const, content: "", compiled: "" },
		style: { language: "css" as const, content: "", compiled: "" },
		script: { language: "javascript" as const, content: "", compiled: "" },
		result: "<main />",
	}));
	const destroy = vi.fn(async () => {});

	const sdk = {
		watch(event: string, handler: unknown) {
			if (event === "code") codeHandlers.push(handler as CodeHandler);
			if (event === "console") consoleHandlers.push(handler as ConsoleHandler);
			return {
				remove: () => removedSubscriptions.push(event),
			};
		},
		setConfig,
		run,
		getCode,
		destroy,
	} as unknown as LiveCodesPlayground;

	return {
		sdk,
		codeHandlers,
		consoleHandlers,
		removedSubscriptions,
		setConfig,
		run,
		getCode,
		destroy,
	};
}

function createHandlers() {
	return {
		results: [] as string[],
		logs: [] as Array<{ method: string; args: unknown[] }>,
	} satisfies {
		results: string[];
		logs: Array<{ method: string; args: unknown[] }>;
	};
}

describe("LiveCodes runtime adapter", () => {
	it("forwards code and console events and removes subscriptions", async () => {
		const fake = createFakeSdk();
		const output = createHandlers();
		const handlers: LiveCodesRuntimeHandlers = {
			onCode: (result) => output.results.push(result),
			onConsole: (method, args) => output.logs.push({ method, args }),
		};
		const runtime = createLiveCodesRuntime(fake.sdk, handlers);

		fake.codeHandlers[0]({ code: { result: "<h1>ready</h1>" } });
		fake.consoleHandlers[0]({ method: "log", args: ["hello"] });
		await runtime.destroy();

		expect(output.results).toEqual(["<h1>ready</h1>"]);
		expect(output.logs).toEqual([{ method: "log", args: ["hello"] }]);
		expect(fake.removedSubscriptions).toEqual(["code", "console"]);
		expect(fake.destroy).toHaveBeenCalledOnce();
	});

	it("serializes async updates so newer config cannot overtake older config", async () => {
		const fake = createFakeSdk();
		let resolveFirst!: (config: Config) => void;
		let resolveSecond!: (config: Config) => void;
		fake.setConfig
			.mockImplementationOnce(
				(config) => new Promise((resolve) => (resolveFirst = () => resolve(config as Config))),
			)
			.mockImplementationOnce(
				(config) => new Promise((resolve) => (resolveSecond = () => resolve(config as Config))),
			);

		const runtime = createLiveCodesRuntime(fake.sdk, {
			onCode: () => {},
			onConsole: () => {},
		});
		const first = runtime.sync({ title: "first" });
		const second = runtime.sync({ title: "second" });

		await Promise.resolve();
		expect(fake.setConfig).toHaveBeenCalledTimes(1);
		resolveFirst({} as Config);
		await first;
		await Promise.resolve();
		expect(fake.setConfig).toHaveBeenCalledTimes(2);
		resolveSecond({} as Config);
		await second;

		expect(fake.setConfig.mock.calls.map(([config]) => config.title)).toEqual(["first", "second"]);
		await runtime.destroy();
	});
});
