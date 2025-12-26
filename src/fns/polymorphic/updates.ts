import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { allRestrictedUpdates, allUpdates } from "content-collections";

const getUpdates = createServerFn().handler(async () => {
  const restrictedUpdates = allRestrictedUpdates.map((update) => ({
    id: update._meta.path,
    title: update.title,
    tag: update.tag,
    date: update.date,
    restricted: true,
  }));

  const updates = allUpdates.map((update) => ({
    id: update._meta.path,
    title: update.title,
    tag: update.tag,
    date: update.date,
    restricted: false,
  }));

  return [...updates, ...restrictedUpdates].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
});

export const getUpdatesQueryOptions = queryOptions({
  queryKey: ["updates"],
  queryFn: getUpdates,
});
