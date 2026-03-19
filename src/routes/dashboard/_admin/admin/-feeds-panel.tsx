import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";
import {
  createFeedMutationOptions,
  deleteFeedMutationOptions,
  getAdminFeedsQueryOptions,
  updateFeedMutationOptions,
} from "@/fns/polymorphic/feeds";
import { formatDate } from "@/lib/utils";

type Feed = {
  id: string;
  date: Date;
  tag: string;
  content: string;
  draft: boolean;
};

type FormMode = { type: "create" } | { type: "edit"; feed: Feed };

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function FeedForm({ mode, onClose }: { mode: FormMode; onClose: () => void }) {
  const queryClient = useQueryClient();
  const createMutation = useMutation(createFeedMutationOptions);
  const updateMutation = useMutation(updateFeedMutationOptions);

  const initial = mode.type === "edit" ? mode.feed : null;

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: getAdminFeedsQueryOptions.queryKey,
      }),
      queryClient.invalidateQueries({ queryKey: ["public-feeds"] }),
    ]);

  const form = useForm({
    defaultValues: {
      date: initial
        ? toDateInputValue(initial.date)
        : toDateInputValue(new Date()),
      tag: initial?.tag ?? "",
      content: initial?.content ?? "",
      draft: initial?.draft ?? false,
    },
    onSubmit: async ({ value }) => {
      const plainContent = value.content.replace(/<[^>]*>/g, "").trim();
      if (!plainContent) {
        form.setFieldMeta("content", (prev) => ({
          ...prev,
          errorMap: {
            onChange: "Content is required",
          },
        }));
        return;
      }

      try {
        if (mode.type === "create") {
          await createMutation.mutateAsync({ data: value });
          toast.success("Feed entry created.");
        } else {
          await updateMutation.mutateAsync({
            data: { id: mode.feed.id, ...value },
          });
          toast.success("Feed entry updated.");
        }
        await invalidate();
        onClose();
      } catch {
        toast.error("Something went wrong.");
      }
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(e.target);
  };

  return (
    <div className="border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl">
          {mode.type === "create" ? "New Feed Entry" : "Edit Feed Entry"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-foreground/50 hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field
              name="date"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Date is required" : undefined,
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <Input
                      id={field.name}
                      type="date"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((e) => ({
                          message: String(e),
                        }))}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field
              name="tag"
              validators={{
                onChange: ({ value }) =>
                  !value.trim() ? "Tag is required" : undefined,
              }}
            >
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Tag</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="e.g. meta, oss, feature"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError
                        errors={field.state.meta.errors.map((e) => ({
                          message: String(e),
                        }))}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="content">
            {(field) => (
              <Field>
                <FieldLabel>Content</FieldLabel>
                <RichTextEditor
                  defaultValue={field.state.value}
                  onChange={(html) => field.handleChange(html)}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="draft">
            {(field) => (
              <Field orientation="horizontal">
                <input
                  id={field.name}
                  type="checkbox"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="size-4"
                />
                <FieldLabel htmlFor={field.name}>
                  Draft (hidden from public)
                </FieldLabel>
              </Field>
            )}
          </form.Field>

          <div className="flex gap-2">
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Spinner />}
                  Save
                </Button>
              )}
            </form.Subscribe>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export function FeedsPanel() {
  const queryClient = useQueryClient();
  const { data: feeds } = useSuspenseQuery(getAdminFeedsQueryOptions);
  const deleteMutation = useMutation(deleteFeedMutationOptions);

  const [formMode, setFormMode] = useState<FormMode | null>(null);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this feed entry?")) return;
    try {
      await deleteMutation.mutateAsync({ data: { id } });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getAdminFeedsQueryOptions.queryKey,
        }),
        queryClient.invalidateQueries({ queryKey: ["public-feeds"] }),
      ]);
      toast.success("Feed entry deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      {formMode ? (
        <FeedForm mode={formMode} onClose={() => setFormMode(null)} />
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setFormMode({ type: "create" })}>
            <PlusIcon className="size-4" />
            New Entry
          </Button>
        </div>
      )}

      {feeds.length === 0 ? (
        <div className="border border-dashed border-border py-16 flex flex-col items-center justify-center gap-4 text-center">
          <p className="font-serif text-2xl text-foreground/40">
            Nothing here yet.
          </p>
          <p className="text-sm text-foreground/40 max-w-xs">
            Feed entries you create will show up here. Hit "New Entry" to write
            your first one.
          </p>
          <Button
            variant="outline"
            onClick={() => setFormMode({ type: "create" })}
          >
            <PlusIcon className="size-4" />
            New Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="border border-border p-4 flex items-start justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs text-foreground/50 uppercase tracking-widest">
                    {formatDate(feed.date)}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest border border-border px-2 py-0.5 text-foreground/60">
                    {feed.tag}
                  </span>
                  {feed.draft && (
                    <span className="font-mono text-xs uppercase tracking-widest border border-yellow-600 text-yellow-600 px-2 py-0.5">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/70 truncate">
                  {feed.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setFormMode({ type: "edit", feed })}
                  className="text-foreground/40 hover:text-foreground duration-200"
                  aria-label="Edit"
                >
                  <PencilIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(feed.id)}
                  disabled={deleteMutation.isPending}
                  className="text-foreground/40 hover:text-destructive duration-200"
                  aria-label="Delete"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
