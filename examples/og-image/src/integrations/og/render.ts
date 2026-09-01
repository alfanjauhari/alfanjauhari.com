import type { RenderInput } from "@alfanjauhari/astro-og-images";
import { renderBranded } from "./branded";
import { renderMinimal } from "./minimal";
import { renderRouteAware } from "./route-aware";
import type { OgTemplateInput } from "./types";

export function renderOgImage(input: OgTemplateInput): RenderInput | Promise<RenderInput> {
	if (input.pathname === "/" || input.pathname === "/minimal") {
		return renderMinimal(input);
	}

	if (input.pathname === "/branded") {
		return renderBranded(input);
	}

	return renderRouteAware(input);
}
