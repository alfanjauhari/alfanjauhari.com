import type { Code, Config, Playground as LiveCodesPlayground } from "livecodes";

// #region Public types
export interface LiveCodesRuntimeHandlers {
	onCode: (result: string) => void;
	onConsole: (method: string, args: unknown[]) => void;
}

export interface LiveCodesRuntime {
	sync(config: Partial<Config>): Promise<Code>;
	run(): Promise<Code>;
	destroy(): Promise<void>;
}
// #endregion

// #region Runtime factory
/**
 * Wraps the asynchronous LiveCodes SDK in a serialized queue. Monaco can
 * produce updates faster than compilation completes; serializing SDK work
 * ensures an older `setConfig` cannot finish after a newer one and replace
 * the preview with stale output.
 */
export function createLiveCodesRuntime(
	sdk: LiveCodesPlayground,
	handlers: LiveCodesRuntimeHandlers,
): LiveCodesRuntime {
	let disposed = false;
	let queue = Promise.resolve();

	const codeSubscription = sdk.watch("code", ({ code }) => {
		if (!disposed) handlers.onCode(code.result);
	});
	const consoleSubscription = sdk.watch("console", ({ method, args }) => {
		if (!disposed) handlers.onConsole(method, args);
	});

	function enqueue<T>(task: () => Promise<T>): Promise<T> {
		const next = queue.then(() => {
			if (disposed) {
				return Promise.reject(new Error("LiveCodes runtime is disposed."));
			}
			return task();
		});
		queue = next.then(
			() => undefined,
			() => undefined,
		);
		return next;
	}

	return {
		sync(config) {
			return enqueue(async () => {
				await sdk.setConfig(config);
				return sdk.getCode();
			});
		},
		run() {
			return enqueue(async () => {
				await sdk.run();
				return sdk.getCode();
			});
		},
		async destroy() {
			if (disposed) return;
			const pending = queue;
			disposed = true;
			codeSubscription.remove();
			consoleSubscription.remove();
			await pending.catch(() => {});
			await sdk.destroy();
		},
	};
}
// #endregion
