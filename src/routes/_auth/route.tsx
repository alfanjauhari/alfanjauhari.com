import { createFileRoute, Outlet } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PAGE_TRANSITIONS } from "@/constants";
import { nonAuthenticatedMiddleware } from "@/middleware/auth";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  server: {
    middleware: [nonAuthenticatedMiddleware],
  },
  notFoundComponent: () => {
    return <p>This setting page doesn't exist!</p>;
  },
});

function RouteComponent() {
  return (
    <motion.div
      className="flex flex-col justify-center items-center"
      {...PAGE_TRANSITIONS}
    >
      <Outlet />
    </motion.div>
  );
}
