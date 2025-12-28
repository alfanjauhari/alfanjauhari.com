import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth.server";

export const getSessionFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  return session;
});
