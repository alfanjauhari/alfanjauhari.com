import { type CreateEmailOptions, Resend } from "resend";
import { env } from "cloudflare:workers";

export async function sendEmail(options: CreateEmailOptions) {
	const resend = new Resend(env.RESEND_API_TOKEN);
	return resend.emails.send(options);
}
