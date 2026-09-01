import { element, type RenderInput } from "@alfanjauhari/astro-og-images";
import type { OgTemplateInput } from "./types";

export function renderMinimal({ description, title }: OgTemplateInput): RenderInput {
	return element(
		"div",
		{
			tw: "flex h-full w-full flex-col justify-center bg-white px-20 text-black",
		},
		element("h1", { tw: "text-6xl font-bold" }, title),
		description && element("p", { tw: "mt-6 text-2xl text-gray-600" }, description),
	);
}
