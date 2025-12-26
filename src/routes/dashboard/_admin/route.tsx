import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { authMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/dashboard/_admin")({
  component: RouteComponent,
  server: {
    // TODO: Add role middleware
    middleware: [authMiddleware],
  },
});

function RouteComponent() {
  return (
    <motion.div {...PAGE_TRANSITIONS}>
      <Outlet />
    </motion.div>
  );
}
