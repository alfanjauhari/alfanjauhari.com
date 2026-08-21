import type { AstroIntegration } from "astro";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Renderer, type Font, type OutputFormat } from "@takumi-rs/core";
import { fromJsx } from "takumi-js/helpers/jsx";
import type { ReactElementLike } from "takumi-js/helpers";
import { extractOgMetadata } from "./extract";

export interface OgRenderInput {
	description?: string;
	image: string;
	pathname: string;
	title: string;
	type: string;
	url: string;
}

export type OgRender = (input: OgRenderInput) => ReactElementLike | Promise<ReactElementLike>;
export type OgFormat = Extract<OutputFormat, "jpeg" | "png" | "webp">;

export interface OgImagesOptions {
	fontFamilies?: string[];
	fonts: Font[];
	height?: number;
	format?: OgFormat;
	quality?: number;
	render: OgRender;
	verbose?: boolean;
	width?: number;
}

const defaults = {
	height: 630,
	format: "webp" as OgFormat,
	quality: 100,
	verbose: false,
	width: 1200,
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

export default function ogImages(input: OgImagesOptions): AstroIntegration {
	const options = { ...defaults, ...input };

	return {
		name: "og-images",
		hooks: {
			"astro:build:done": async ({ dir, logger, pages }) => {
				const outputDir = fileURLToPath(dir);
				const renderer = new Renderer();

				await Promise.all(options.fonts.map((font) => renderer.registerFont(font)));

				await Promise.all(
					pages.map(async (page) => {
						const htmlFile = await getHtmlFile(outputDir, page.pathname);

						if (!htmlFile) return;

						const html = await readFile(htmlFile, "utf8");
						const pageDetails = extractOgMetadata(html);
						const element = await options.render({ ...page, ...pageDetails });
						const { node, stylesheets } = await fromJsx(element);
						const imageBuffer = await renderer.render(node, {
							fontFamilies: options.fontFamilies,
							format: options.format,
							height: options.height,
							quality: options.quality,
							stylesheets,
							width: options.width,
						});
						const imageFile = htmlFile.replace(/\.html$/, `.${options.format}`);

						await writeFile(imageFile, imageBuffer);

						const expectedImagePath = getRelativePath(outputDir, imageFile);
						const actualImagePath = getImagePath(pageDetails.image);

						if (actualImagePath !== expectedImagePath) {
							throw new Error(
								`The og:image property in ${htmlFile} (${actualImagePath}) does not match the generated image (${expectedImagePath}).`
							);
						}

						if (options.verbose) {
							logger.info(`Generated ${expectedImagePath} for ${htmlFile}.`);
						}
					})
				);
			},
		},
	};
}
