import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionFn } from "@/fns/polymorphic/auth";

export const Route = createFileRoute("/dashboard/_user")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSessionFn();

    if (!session) {
      throw redirect({
        to: "/auth/login",
      });
    }

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
