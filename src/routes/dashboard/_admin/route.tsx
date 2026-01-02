import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
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
    <div className="page-transition">
      <Outlet />
    </div>
  );
}
