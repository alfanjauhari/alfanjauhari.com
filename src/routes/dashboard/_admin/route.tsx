import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { adminMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/dashboard/_admin")({
  component: RouteComponent,
  server: {
    middleware: [adminMiddleware],
  },
});

function RouteComponent() {
  return (
    <motion.div {...PAGE_TRANSITIONS}>
      <Outlet />
    </motion.div>
  );
}
