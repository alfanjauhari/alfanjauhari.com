import { type CreateEmailOptions, Resend } from "resend";
import { RESEND_API_TOKEN } from "astro:env/server";

export async function sendEmail(options: CreateEmailOptions) {
	const resend = new Resend(RESEND_API_TOKEN);
	return resend.emails.send(options);
}
