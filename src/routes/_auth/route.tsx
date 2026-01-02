import { createFileRoute, Outlet } from "@tanstack/react-router";
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
    <div className="flex flex-col justify-center items-center page-transition">
      <Outlet />
    </div>
  );
}
