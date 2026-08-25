import { JSDOM } from "jsdom";

export interface OgPageDetails {
	title: string;
	description?: string;
	url: string;
	type: string;
	image: string;
}

function sanitizeHtml(html: string) {
	return html
		.replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gim, "")
		.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/gim, "");
}

export function extractOgMetadata(html: string): OgPageDetails {
	const document = new JSDOM(sanitizeHtml(html)).window.document;
	const readMeta = (property: string) =>
		document.querySelector(`meta[property='og:${property}']`)?.getAttribute("content");

	const title = readMeta("title");
	const description = readMeta("description");
	const url = readMeta("url");
	const type = readMeta("type");
	const image = readMeta("image");
	const errors: string[] = [];

	if (!title) errors.push("og:title");
	if (!url) errors.push("og:url");
	if (!type) errors.push("og:type");
	if (!image) errors.push("og:image");

	if (errors.length > 0) {
		throw new Error(`Missing required meta tags: ${errors.join(", ")}`);
	}
	if (!title || !url || !type || !image) {
		throw new Error("Required Open Graph metadata is empty.");
	}

	return {
		description: description && description !== title ? description : undefined,
		image,
		title,
		type,
		url,
	};
}
