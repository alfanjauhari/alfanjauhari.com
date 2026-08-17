import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
	const request = new Request(ctx.request);
	request.headers.set("x-forwarded-for", ctx.clientAddress);

	return auth.handler(request);
};
