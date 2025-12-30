import { type CreateEmailOptions, Resend } from "resend";
import { serverEnv } from "@/env/server";

export function sendEmail(options: CreateEmailOptions) {
  const resend = new Resend(serverEnv.RESEND_API_TOKEN);
  return resend.emails.send(options);
}
