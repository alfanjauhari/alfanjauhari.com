import { OutputFormat } from "takumi-js";

export function getOgImagePath({
	format = "webp",
	site,
	url,
}: {
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

	if (target === `/404/index.${format}`) return new URL(`404.${format}`, site).toString();
	if (target === `/500/index.${format}`) return new URL(`500.${format}`, site).toString();

	return new URL(target.slice(1), site).toString();
}
