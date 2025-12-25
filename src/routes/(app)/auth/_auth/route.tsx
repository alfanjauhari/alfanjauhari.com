import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { nonAuthenticatedMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/(app)/auth/_auth")({
  component: RouteComponent,
  server: {
    middleware: [nonAuthenticatedMiddleware],
  },
});

function RouteComponent() {
  return (
    <motion.div
      className="min-h-[calc(100vh-6rem*2)] flex flex-col justify-center items-center"
      {...PAGE_TRANSITIONS}
    >
      <Outlet />
    </motion.div>
  );
}
