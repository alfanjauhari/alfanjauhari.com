import { OutputFormat } from "takumi-js";

import { normalizeBasePath } from "./url-path";

export function getOgImagePath({
	base = "/",
	format = "webp",
	site,
	url,
}: {
	base?: string;
	format?: OutputFormat;
	site: URL | undefined;
	url: URL;
}) {
	if (!site) {
		throw new Error(
			"`site` must be set in your Astro configuration: https://docs.astro.build/en/reference/configuration-reference/#site",
		);
	}

	let target = url.pathname;

	if (target.endsWith("/")) {
		target += `index.${format}`;
	} else {
		target += `.${format}`;
	}

	const basePath = normalizeBasePath(base).replace(/\/?$/, "/");
	if (target === `${basePath}404/index.${format}`)
		return new URL(`${basePath}404.${format}`, site).toString();
	if (target === `${basePath}500/index.${format}`)
		return new URL(`${basePath}500.${format}`, site).toString();

	return new URL(target.slice(1), site).toString();
}
