import { notFound } from "@tanstack/react-router";
import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { client } from "@/db/client";
import { verificationsTable } from "@/db/schemas/verifications";
import { auth } from "@/lib/auth.server";

export const getSessionFn = createServerOnlyFn(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  return session;
});

export const checkToken = createServerOnlyFn(
  async (type: "reset-password", token: string) => {
    const tokens = await client
      .select({ id: verificationsTable.id })
      .from(verificationsTable)
      .where(eq(verificationsTable.identifier, `${type}:${token}`))
      .limit(1);

    if (!tokens.length) {
      throw notFound();
    }
  },
);
