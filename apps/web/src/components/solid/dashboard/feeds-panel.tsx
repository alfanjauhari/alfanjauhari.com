import { actions } from "astro:actions";
import { createForm, Field as FormField, Form, reset } from "@formisch/solid";
import { RichTextEditor } from "@alfanjauhari/solid-prosemirror";
import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import * as v from "valibot";
import { cn, formatDate } from "../../../lib/utils";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

interface Feed {
	id: string;
	tag: string;
	content: string;
	draft: boolean;
	createdAt: string;
	updatedAt: string;
}

type FormMode = { type: "create" } | { type: "edit"; feed: Feed };

const FeedSchema = v.object({
	tag: v.pipe(v.string("Tag is required"), v.minLength(1, "Tag is required")),
	content: v.pipe(
		v.string(),
		v.check((content) => content.replace(/<[^>]*>/g, "").trim().length > 0, "Content is required"),
	),
	draft: v.boolean(),
});

function FeedForm(props: {
	mode: FormMode;
	onClose: () => void;
	onSaved: () => void;
	onError: (message: string) => void;
}) {
	const form = createForm({
		schema: FeedSchema,
		initialInput: {
			tag: props.mode.type === "edit" ? props.mode.feed.tag : "",
			content: props.mode.type === "edit" ? props.mode.feed.content : "",
			draft: props.mode.type === "edit" ? props.mode.feed.draft : false,
		},
	});

	const onSubmit = async (output: v.InferOutput<typeof FeedSchema>) => {
		const fd = new FormData();
		fd.append("tag", output.tag);
		fd.append("content", output.content);
		fd.append("draft", String(output.draft));

		if (props.mode.type === "edit") {
			fd.append("id", props.mode.feed.id);
			const { error } = await actions.updateFeed(fd);

			if (error) {
				props.onError(error.message);
				return;
			}
		} else {
			const { error } = await actions.createFeed(fd);

			if (error) {
				props.onError(error.message);
				return;
			}
		}

		reset(form);
		props.onSaved();
	};

	return (
		<div class="border border-border p-6 space-y-4">
			<div class="flex items-center justify-between">
				<h3 class="font-serif text-2xl">
					{props.mode.type === "create" ? "New Feed Entry" : "Edit Feed Entry"}
				</h3>
				<button
					type="button"
					onClick={props.onClose}
					class="text-foreground/50 hover:text-foreground"
					aria-label="Close"
				>
					<XIcon class="size-4" />
				</button>
			</div>

			<Form of={form} onSubmit={onSubmit}>
				<FieldGroup>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FormField of={form} path={["tag"]}>
							{(field) => {
								const isInvalid = () => field.isTouched && !field.isValid;

								return (
									<Field data-invalid={isInvalid()}>
										<FieldLabel for={field.props.name}>Tag</FieldLabel>
										<Input
											{...field.props}
											value={field.input}
											placeholder="e.g. meta, oss, feature"
											aria-invalid={isInvalid()}
										/>
										<Show when={isInvalid()}>
											<FieldError errors={field.errors} />
										</Show>
									</Field>
								);
							}}
						</FormField>
					</div>

					<FormField of={form} path={["content"]}>
						{(field) => (
							<Field data-invalid={!!field.errors}>
								<FieldLabel>Content</FieldLabel>
								<RichTextEditor
									defaultValue={field.input}
									onChange={(html) => field.onInput(html)}
								/>
								<Show when={field.errors}>
									<FieldError errors={field.errors} />
								</Show>
							</Field>
						)}
					</FormField>

					<FormField of={form} path={["draft"]}>
						{(field) => (
							<Field orientation="horizontal">
								<input
									id={field.props.name}
									type="checkbox"
									{...field.props}
									checked={field.input}
									class="size-4"
								/>
								<FieldLabel for={field.props.name}>Draft (hidden from public)</FieldLabel>
							</Field>
						)}
					</FormField>

					<div class="flex gap-2">
						<Button type="submit" disabled={form.isSubmitting}>
							<Show when={form.isSubmitting}>
								<Spinner />
							</Show>
							Save
						</Button>
						<Button type="button" variant="outline" onClick={props.onClose}>
							Cancel
						</Button>
					</div>
				</FieldGroup>
			</Form>
		</div>
	);
}

export function FeedsPanel(props: { feeds: Feed[] }) {
	const [feeds, setFeeds] = createSignal<Feed[]>(props.feeds);
	const [formMode, setFormMode] = createSignal<FormMode | null>(null);
	const [status, setStatus] = createSignal<{ type: "error" | "success"; text: string }>();
	const [deletingId, setDeletingId] = createSignal<string>();

	const refetch = async () => {
		const { data, error } = await actions.getAdminFeeds();
		if (!error) setFeeds(data);
	};

	const onDelete = async (id: string) => {
		if (!confirm("Delete this feed entry?")) return;

		setDeletingId(id);

		const fd = new FormData();
		fd.append("id", id);

		const { error } = await actions.deleteFeed(fd);

		if (error) {
			setStatus({ type: "error", text: "Failed to delete." });
			setDeletingId(undefined);
			return;
		}

		setStatus({ type: "success", text: "Feed entry deleted." });
		setDeletingId(undefined);
		await refetch();
	};

	return (
		<div class="space-y-6">
			<Show
				when={formMode()}
				fallback={
					<div class="flex justify-between items-center gap-4">
						<Show when={status()}>
							<p
								class={cn(
									"font-mono text-xs",
									status()?.type === "error" ? "text-destructive" : "text-foreground/50",
								)}
							>
								{status()?.text}
							</p>
						</Show>
						<div class="ml-auto">
							<Button onClick={() => setFormMode({ type: "create" })}>
								<PlusIcon class="size-4" />
								New Entry
							</Button>
						</div>
					</div>
				}
			>
				<FeedForm
					mode={formMode() as FormMode}
					onClose={() => setFormMode(null)}
					onSaved={() => {
						setStatus({
							type: "success",
							text: formMode()?.type === "edit" ? "Feed entry updated." : "Feed entry created.",
						});
						setFormMode(null);
						refetch();
					}}
					onError={(message) => setStatus({ type: "error", text: message })}
				/>
			</Show>

			<Show
				when={feeds().length === 0}
				fallback={
					<div class="space-y-3">
						<For each={feeds()}>
							{(feed) => (
								<div class="border border-border p-4 flex items-start justify-between gap-4">
									<div class="space-y-1 min-w-0">
										<div class="flex items-center gap-3 flex-wrap">
											<span class="font-mono text-xs text-foreground/50 uppercase tracking-widest">
												{formatDate(new Date(feed.createdAt))}
											</span>
											<span class="font-mono text-xs uppercase tracking-widest border border-border px-2 py-0.5 text-foreground/60">
												{feed.tag}
											</span>
											<Show when={feed.draft}>
												<span class="font-mono text-xs uppercase tracking-widest border border-yellow-600 text-yellow-600 px-2 py-0.5">
													Draft
												</span>
											</Show>
										</div>
										<div class="prose prose-sm dark:prose-invert" innerHTML={feed.content} />
									</div>
									<div class="flex gap-2 shrink-0">
										<button
											type="button"
											onClick={() => setFormMode({ type: "edit", feed })}
											class="text-foreground/40 hover:text-foreground duration-200"
											aria-label="Edit"
										>
											<PencilIcon class="size-4" />
										</button>
										<button
											type="button"
											onClick={() => onDelete(feed.id)}
											disabled={deletingId() === feed.id}
											class="text-foreground/40 hover:text-destructive duration-200"
											aria-label="Delete"
										>
											<Show
												when={deletingId() === feed.id}
												fallback={<Trash2Icon class="size-4" />}
											>
												<Spinner class="size-4" />
											</Show>
										</button>
									</div>
								</div>
							)}
						</For>
					</div>
				}
			>
				<div class="border border-dashed border-border py-16 flex flex-col items-center justify-center gap-4 text-center">
					<p class="font-serif text-2xl text-foreground/40">Nothing here yet.</p>
					<p class="text-sm text-foreground/40 max-w-xs">
						Feed entries you create will show up here. Hit "New Entry" to write your first one.
					</p>
					<Button variant="outline" onClick={() => setFormMode({ type: "create" })}>
						<PlusIcon class="size-4" />
						New Entry
					</Button>
				</div>
			</Show>
		</div>
	);
}
