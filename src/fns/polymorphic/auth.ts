import { formOptions } from "@tanstack/react-form";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { client } from "@/db/client";
import { verificationsTable } from "@/db/schemas/verifications";
import { auth } from "@/lib/auth.server";

export const getSessionFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  return session;
});

export const checkToken = createServerFn()
  .inputValidator(
    z.object({
      type: z.enum(["reset-password"]),
      token: z.string,
    }),
  )
  .handler(async ({ data }) => {
    const { type, token } = data;

    const tokens = await client
      .select({ id: verificationsTable.id })
      .from(verificationsTable)
      .where(eq(verificationsTable.identifier, `${type}:${token}`))
      .limit(1);

    if (!tokens.length) {
      throw notFound();
    }

    return true;
  });

const LoginSchema = z.object({
  email: z.email(),
});

export const loginFormOpts = formOptions({
  defaultValues: {
    email: "",
  },
  validators: {
    onChange: LoginSchema,
  },
});
