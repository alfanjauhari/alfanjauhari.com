import { ActionError } from "astro:actions";
import { env } from "cloudflare:workers";

export function isAdminEmail(email: string) {
	const admins = (env.ADMIN_EMAIL ?? "")
		.split(",")
		.map((entry) => entry.trim().toLowerCase())
		.filter(Boolean);

	return admins.includes(email.toLowerCase());
}

export function requireUser(ctx: { locals: App.Locals }) {
	const user = ctx.locals.user;
	if (!user) throw new ActionError({ code: "UNAUTHORIZED", message: "You must be logged in." });
	return user;
}

export function requireAdmin(ctx: { locals: App.Locals }) {
	const user = requireUser(ctx);

	if (!isAdminEmail(user.email)) {
		throw new ActionError({
			code: "FORBIDDEN",
			message: "You don't have access to this.",
		});
	}

	return user;
}
