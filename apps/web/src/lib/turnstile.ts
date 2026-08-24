import { CLOUDFLARE_TURNSTILE_SECRET_KEY } from "astro:env/server";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerification {
	success: boolean;
	"error-codes"?: string[];
}

export async function verifyTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
	try {
		const formData = new FormData();
		formData.append("secret", CLOUDFLARE_TURNSTILE_SECRET_KEY);
		formData.append("response", token);

		if (remoteip) {
			formData.append("remoteip", remoteip);
		}

		const response = await fetch(SITEVERIFY_URL, {
			method: "POST",
			body: formData,
		});

		const result = (await response.json()) as TurnstileVerification;

		return result.success === true;
	} catch {
		return false;
	}
}
