import { element, type RenderInput } from "@alfanjauhari/astro-og-images";
import type { OgTemplateInput } from "./types";

function routeLabel(pathname: string, type: string) {
	if (pathname === "/branded") return "Featured story";
	if (pathname.startsWith("/posts/")) return "Journal";

	return type;
}

function trim(value: string | undefined, maxLength: number) {
	if (!value || value.length <= maxLength) return value;

	return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

export function renderBranded({
	description,
	pathname,
	title,
	type,
}: OgTemplateInput): RenderInput {
	const label = routeLabel(pathname, type);
	const excerpt = trim(description, 150);

	return element(
		"div",
		{
			tw: "flex h-full w-full flex-col justify-between overflow-hidden",
			style: {
				backgroundColor: "#111827",
				color: "#f9fafb",
				padding: 64,
			},
		},
		element(
			"div",
			{ tw: "flex items-center justify-between" },
			element(
				"span",
				{
					style: {
						color: "#93c5fd",
						fontSize: 24,
						fontWeight: 700,
						letterSpacing: 1,
					},
				},
				"YOUR BRAND",
			),
			element(
				"span",
				{
					style: {
						border: "1px solid rgba(147, 197, 253, 0.45)",
						borderRadius: 999,
						color: "#bfdbfe",
						fontSize: 16,
						padding: "10px 16px",
						textTransform: "uppercase",
					},
				},
				label,
			),
		),
		element(
			"div",
			{ tw: "flex flex-col" },
			element(
				"h1",
				{
					style: {
						fontSize: 76,
						fontWeight: 700,
						letterSpacing: -2,
						lineHeight: 0.98,
						margin: 0,
						maxWidth: 980,
					},
				},
				title,
			),
			excerpt
				? element(
						"p",
						{
							style: {
								color: "#cbd5e1",
								fontSize: 26,
								lineHeight: 1.35,
								margin: "28px 0 0",
								maxWidth: 820,
							},
						},
						excerpt,
					)
				: null,
		),
		element(
			"div",
			{
				tw: "flex items-end justify-between",
				style: {
					borderTop: "1px solid rgba(255, 255, 255, 0.15)",
					color: "#94a3b8",
					fontSize: 18,
					paddingTop: 24,
				},
			},
			element("span", {}, "example.com"),
			element("span", {}, pathname),
		),
	);
}
