import type { AstroIntegration } from "astro";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractOgMetadata } from "./extract";
import { render, RenderOptions, RenderInput } from "takumi-js";

export interface OgRenderInput {
	description?: string;
	image: string;
	pathname: string;
	title: string;
	type: string;
	url: string;
}

export type OgRender = (input: OgRenderInput) => RenderInput | Promise<RenderInput>;
export type OgImageOptions = RenderOptions & {
	render: OgRender;
	verbose?: boolean;
};

async function fileExists(filePath: string) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function getHtmlFile(outputDir: string, pathname: string) {
	const normalizedPath = pathname.replace(/^\/+/, "");
	const directoryPath = path.join(outputDir, normalizedPath, "index.html");
	const filePath = path.join(outputDir, `${normalizedPath.replace(/\/$/, "")}.html`);

	if (await fileExists(directoryPath)) return directoryPath;
	if (await fileExists(filePath)) return filePath;

	return undefined;
}

function getRelativePath(outputDir: string, filePath: string) {
	return path.relative(outputDir, filePath).split(path.sep).join("/");
}

function getImagePath(image: string) {
	return new URL(image, "https://og-image.invalid").pathname.slice(1);
}

export default function ogImages(options: OgImageOptions): AstroIntegration {
	return {
		name: "og-images",
		hooks: {
			"astro:build:done": async ({ dir, logger, pages }) => {
				const outputDir = fileURLToPath(dir);

				await Promise.all(
					pages.map(async (page) => {
						const htmlFile = await getHtmlFile(outputDir, page.pathname);

						if (!htmlFile) return;

						const html = await readFile(htmlFile, "utf8");
						const pageDetails = extractOgMetadata(html);

						const element = await options.render({ ...page, ...pageDetails });

						const imageBuffer = await render(element, options);

						// Remove the .html extension from the image file if the URL does not end with .html
						// This is possible if we build astro with build.format = "file"
						const shouldRemoveHtmlExtension = !pageDetails.url.endsWith(".html");
						const imageFile = shouldRemoveHtmlExtension
							? htmlFile.replace(/\.html$/, `.${options.format}`)
							: `${htmlFile}.${options.format}`;

						await writeFile(imageFile, imageBuffer);

						const expectedImagePath = getRelativePath(outputDir, imageFile);
						const actualImagePath = getImagePath(pageDetails.image);

						if (actualImagePath !== expectedImagePath) {
							throw new Error(
								`The og:image property in ${htmlFile} (${actualImagePath}) does not match the generated image (${expectedImagePath}).`,
							);
						}

						if (options.verbose) {
							logger.info(`Generated ${expectedImagePath} for ${htmlFile}.`);
						}
					}),
				);
			},
		},
	};
}

export { extractOgMetadata } from "./extract";
export type { OgPageDetails } from "./extract";
export { element } from "./element";
export type { ElementChild, ElementNode, ElementProps, ElementType } from "./element";
export type { ReactElementLike } from "takumi-js/helpers";
export type { RenderInput, RenderOptions } from "takumi-js";
export * from "@takumi-rs/core";
