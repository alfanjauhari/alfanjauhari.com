import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { serverEnv } from "@/env/server";
import { getSessionFn } from "@/fns/polymorphic/auth";

export const Route = createFileRoute("/dashboard/_admin")({
  component: RouteComponent,
  loader: async () => {
    const session = await getSessionFn();

    if (!session) {
      throw notFound();
    }

    const admins = serverEnv.ADMIN_EMAIL.includes(session.user.email);

    if (!admins) {
      throw notFound();
    }

    return session;
  },
});

function RouteComponent() {
  return (
    <motion.div {...PAGE_TRANSITIONS}>
      <Outlet />
    </motion.div>
  );
}
