import { element, type RenderInput } from "@alfanjauhari/astro-og-images";

export interface OgTemplateInput {
	description?: string;
	pathname: string;
	title: string;
}

function getPageType(pathname: string) {
	if (pathname === "" || pathname === "/") return "home";
	if (/^\/updates\/[^/]+\/?$/.test(pathname)) return "update";
	if (/^\/works\/[^/]+\/?$/.test(pathname)) return "work";
	if (/^\/snippets\/[^/]+\/?$/.test(pathname)) return "snippet";

	return "page";
}

function trimText(value: string | undefined, maxLength: number) {
	if (!value || value.length <= maxLength) return value;

	return `${value.slice(0, maxLength - 3).trimEnd()}...`;
}

function header(type: string) {
	return element(
		"div",
		{ tw: "flex items-start justify-between" },
		element(
			"div",
			{ tw: "flex flex-col" },
			element(
				"span",
				{
					style: {
						fontFamily: "Playfair Display",
						fontSize: 30,
						fontWeight: 700,
						letterSpacing: -1,
					},
				},
				"AJ.",
			),
			element(
				"span",
				{
					style: {
						color: "rgba(237, 237, 237, 0.5)",
						fontFamily: "JetBrains Mono",
						fontSize: 14,
						letterSpacing: 3,
						marginTop: 8,
						textTransform: "uppercase",
					},
				},
				"Alfan Jauhari",
			),
		),
		type !== "page"
			? element(
					"div",
					{
						tw: "flex items-center rounded-full",
						style: {
							backgroundColor: "rgba(255, 255, 255, 0.05)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							gap: 12,
							padding: "8px 16px",
						},
					},
					element("div", {
						style: {
							backgroundColor: "#22c55e",
							borderRadius: 999,
							height: 8,
							width: 8,
						},
					}),
					element(
						"span",
						{
							style: {
								color: "#d1d5db",
								fontFamily: "JetBrains Mono",
								fontSize: 12,
								letterSpacing: 2,
								textTransform: "uppercase",
							},
						},
						type === "home" ? "Portfolio" : type,
					),
				)
			: null,
	);
}

function homeContent() {
	return element(
		"div",
		{ tw: "flex flex-col" },
		element(
			"h1",
			{
				style: {
					fontFamily: "Playfair Display",
					fontSize: 96,
					letterSpacing: -4,
					lineHeight: 0.85,
					margin: 0,
				},
			},
			"Alfan Jauhari",
		),
		element(
			"p",
			{
				style: {
					color: "rgba(237, 237, 237, 0.4)",
					fontFamily: "JetBrains Mono",
					fontSize: 24,
					lineHeight: 1.35,
					margin: "32px 0 0",
					maxWidth: 760,
				},
			},
			"A passionate Product Engineer. I build pixel-perfect interfaces and scalable systems for everyone.",
		),
	);
}

function pageContent(title: string, meta: string | undefined) {
	return element(
		"div",
		{ tw: "flex flex-col" },
		element(
			"h1",
			{
				style: {
					fontFamily: "Playfair Display",
					fontSize: 80,
					letterSpacing: -2,
					lineHeight: 0.95,
					margin: 0,
					maxWidth: 920,
				},
			},
			title,
		),
		meta
			? element(
					"p",
					{
						style: {
							borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
							color: "rgba(237, 237, 237, 0.4)",
							fontFamily: "Playfair Display",
							fontSize: 24,
							fontStyle: "italic",
							lineHeight: 1.35,
							margin: "32px 0 0",
							maxWidth: 760,
							paddingLeft: 24,
						},
					},
					meta,
				)
			: null,
	);
}

function footer() {
	const labelStyle = {
		color: "rgba(237, 237, 237, 0.5)",
		fontFamily: "JetBrains Mono",
		fontSize: 10,
		letterSpacing: 2,
		marginBottom: 4,
		textTransform: "uppercase",
	};

	return element(
		"div",
		{
			tw: "flex items-end justify-between",
			style: {
				borderTop: "1px solid rgba(255, 255, 255, 0.1)",
				paddingTop: 32,
			},
		},
		element(
			"div",
			{ tw: "flex", style: { gap: 32 } },
			element(
				"div",
				{ tw: "flex flex-col" },
				element("span", { style: labelStyle }, "Website"),
				element("span", { style: { fontSize: 18, fontWeight: 500 } }, "alfanjauhari.com"),
			),
			element(
				"div",
				{ tw: "flex flex-col" },
				element("span", { style: labelStyle }, "Twitter"),
				element("span", { style: { fontSize: 18, fontWeight: 500 } }, "@alfanjauhari_"),
			),
		),
		element(
			"span",
			{
				style: {
					color: "rgba(237, 237, 237, 0.5)",
					fontFamily: "JetBrains Mono",
					fontSize: 12,
					letterSpacing: 2,
					textTransform: "uppercase",
				},
			},
			"Tulungagung, ID",
		),
	);
}

export function renderOgTemplate({ description, pathname, title }: OgTemplateInput): RenderInput {
	const type = getPageType(pathname);
	const displayTitle = title.replace(/ — Alfan Jauhari$/, "");
	const meta = trimText(description, 180);

	return element(
		"div",
		{
			tw: "w-full h-full flex flex-col justify-between overflow-hidden",
			style: {
				backgroundColor: "#050505",
				color: "#ededed",
				fontFamily: "Inter",
				padding: 64,
			},
		},
		header(type),
		element(
			"div",
			{ tw: "flex flex-1 flex-col justify-center" },
			type === "home" ? homeContent() : pageContent(displayTitle, meta),
		),
		footer(),
	);
}
