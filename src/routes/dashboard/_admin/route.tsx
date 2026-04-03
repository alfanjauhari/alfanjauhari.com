import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getAdminSessionFn } from "@/fns/polymorphic/auth";

export const Route = createFileRoute("/dashboard/_admin")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getAdminSessionFn();

    return session;
  },
});

function RouteComponent() {
  return (
    <div className="page-transition">
      <Outlet />
    </div>
  );
}
