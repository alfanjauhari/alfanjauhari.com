import { createFileRoute } from "@tanstack/react-router";
import { HeartIcon, MessageSquareIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <div className="mb-12">
        <h1 className="font-serif text-5xl mb-4">Hello, {user.name}!</h1>
        <p className="font-mono text-sm text-foreground/50">
          Member since {formatDate(user.createdAt)}
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HeartIcon className="size-6" />
            <span>Like History</span>
            <span className="size-6 rounded-full bg-foreground/10 text-xs flex items-center justify-center">
              10
            </span>
          </div>
          <hr />
          <div className="space-y-4">
            <div className="p-4 bg-foreground/10 space-y-2">
              <p className="font-serif text-lg">Hello World</p>
              <p className="font-mono text-sm text-foreground/50">
                26 Dec 2025
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquareIcon className="size-6" />
            <span>Comment History</span>
            <span className="size-6 rounded-full bg-foreground/10 text-xs flex items-center justify-center">
              10
            </span>
          </div>
          <hr />
          <div className="space-y-4">
            <div className="px-4 border-l-2 border-l-foreground/30 space-y-4">
              <div className="flex justify-between items-center gap-4">
                <p className="font-serif">Hello World</p>
                <span className="text-accent font-mono p-1 bg-foreground uppercase text-xxs">
                  Published
                </span>
              </div>
              <div className="italic text-foreground/70 line-clamp-3">
                "Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Maiores, eveniet! Facilis illo cumque perspiciatis autem
                veritatis commodi unde laboriosam accusantium nesciunt dolore?
                Debitis veniam ipsam obcaecati sapiente velit repudiandae
                nostrum?"
              </div>
              <p className="font-mono text-sm text-foreground/50">
                26 Dec 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
