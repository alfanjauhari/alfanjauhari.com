import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LockIcon } from "lucide-react";
import { getUpdatesQueryOptions } from "@/fns/polymorphic/updates";

export function UpdatesList() {
  const { data } = useSuspenseQuery(getUpdatesQueryOptions);

  return (
    <div className="space-y-4">
      {data.map((update) => (
        <Link
          to={update.restricted ? "/updates/r/$updateId" : "/updates/$updateId"}
          params={{
            updateId: update.id,
          }}
          key={update.id}
          className="border border-border p-6 block hover:border-foreground duration-300 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="font-serif text-2xl">{update.title}</div>
              </div>
              <div className="flex gap-4 text-xs font-mono text-gray-400">
                <span>
                  {new Intl.DateTimeFormat("id-ID").format(update.date)}
                </span>
                <span>•</span>
                <span>{update.tag}</span>
                {update.restricted && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-600 font-bold flex items-center gap-1">
                      <LockIcon className="size-2.5" /> Restricted
                    </span>
                  </>
                )}
              </div>
            </div>
            <p className="text-foreground/50 uppercase font-mono max-lg:hidden lg:invisible group-hover:visible">
              View
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
