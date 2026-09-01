import { element, type RenderInput } from "@alfanjauhari/astro-og-images";
import type { OgTemplateInput } from "./types";

const accents: Record<string, { background: string; foreground: string }> = {
	article: { background: "#312e81", foreground: "#e0e7ff" },
	website: { background: "#064e3b", foreground: "#d1fae5" },
};

export async function renderRouteAware({
	description,
	image,
	pathname,
	title,
	type,
	url,
}: OgTemplateInput): Promise<RenderInput> {
	// Replace this with a deterministic build-time lookup when needed.
	await Promise.resolve();

	const accent = accents[type] ?? { background: "#334155", foreground: "#e2e8f0" };
	const pageUrl = new URL(url);
	const imagePath = new URL(image).pathname;

	return element(
		"div",
		{
			tw: "flex h-full w-full flex-col justify-between",
			style: {
				backgroundColor: accent.background,
				color: accent.foreground,
				padding: 72,
			},
		},
		element(
			"div",
			{ tw: "flex flex-col" },
			element(
				"span",
				{
					style: {
						fontSize: 18,
						fontWeight: 700,
						letterSpacing: 3,
						textTransform: "uppercase",
					},
				},
				type,
			),
			element(
				"h1",
				{
					style: {
						fontSize: 78,
						fontWeight: 700,
						letterSpacing: -2,
						lineHeight: 1,
						margin: "30px 0 0",
						maxWidth: 1000,
					},
				},
				title,
			),
			description
				? element(
						"p",
						{ style: { fontSize: 26, lineHeight: 1.35, margin: "28px 0 0", maxWidth: 850 } },
						description,
					)
				: null,
		),
		element(
			"div",
			{
				tw: "flex items-end justify-between",
				style: { borderTop: "1px solid currentColor", paddingTop: 24 },
			},
			element("span", { style: { fontSize: 20 } }, pathname),
			element("span", { style: { fontSize: 16, opacity: 0.7 } }, `${pageUrl.host}${imagePath}`),
		),
	);
}
