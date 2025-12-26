import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LockIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUpdatesQueryOptions } from "@/fns/polymorphic/updates";

export function UpdatesList() {
  const { data } = useSuspenseQuery(getUpdatesQueryOptions);

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full h-auto group border-dashed py-12"
        asChild
      >
        <Link to="/">
          <PlusIcon className="size-6" />
          <span className="text-xs font-bold uppercase tracking-widest font-mono">
            Create New Update
          </span>
        </Link>
      </Button>
      {data.map((update) => (
        <Link
          to="/dashboard/admin/updates/$updateId"
          params={{
            updateId: update.id,
          }}
          key={update.id}
          className="border border-border p-6 block hover:border-foreground duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                {update.memberOnly && <LockIcon className="size-4" />}
                <div className="font-serif text-2xl">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </div>
              </div>
              <div className="flex gap-4 text-xs font-mono text-gray-400">
                <span>
                  {new Intl.DateTimeFormat("id-ID").format(update.date)}
                </span>
                <span>•</span>
                <span>{update.tag}</span>
              </div>
            </div>
            <p className="text-foreground/50 uppercase font-mono max-lg:hidden lg:invisible group-hover:visible">
              Edit
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
