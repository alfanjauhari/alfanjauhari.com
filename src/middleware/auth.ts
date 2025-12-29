import { notFound, redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { serverEnv } from "@/env/server";
import { auth } from "@/lib/auth.server";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw redirect({ to: "/auth/login" });
  }

  return await next({
    context: {
      session,
    },
  });
});

export const adminMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    const admins = serverEnv.ADMIN_EMAIL.includes(context.session.user.email);

    if (!admins) {
      throw notFound();
    }

    return await next({
      context,
    });
  });

export const nonAuthenticatedMiddleware = createMiddleware().server(
  async ({ next }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (session) {
      throw redirect({
        to: "/",
      });
    }

    return await next();
  },
);
