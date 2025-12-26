import { formOptions } from "@tanstack/react-form";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { allUpdates } from "content-collections";
import type { SerializedEditorState } from "lexical";
import z from "zod";

const getUpdates = createServerFn().handler(async () => {
  return allUpdates.map((update) => ({
    id: update._meta.path,
    title: update.title,
    tag: update.tag,
    date: update.date,
    memberOnly: false,
  }));
});

export const getUpdatesQueryOptions = queryOptions({
  queryKey: ["updates"],
  queryFn: getUpdates,
});

export const NewUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tag: z.string().min(1, "Tag is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.any(),
});
export const newUpdateFormOpts = formOptions({
  defaultValues: {
    title: "",
    tag: "",
    summary: "",
    content: "" as unknown as SerializedEditorState,
  },
  validators: {
    onChange: NewUpdateSchema,
  },
});
