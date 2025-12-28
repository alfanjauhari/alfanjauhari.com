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
      className="min-h-[calc(100vh-6rem*2)] flex flex-col justify-center items-center"
      {...PAGE_TRANSITIONS}
    >
      <h1>Hllo</h1>
      <Outlet />
    </motion.div>
  );
}
