import { actions } from "astro:actions";
import { createForm, Form, Field as FormField, type FormStore, reset } from "@formisch/solid";
import { HeartIcon, MessageSquareIcon, Reply, ReplyIcon, SendIcon, XIcon } from "lucide-solid";
import { createSignal, For, onMount, Show, type Component } from "solid-js";
import * as v from "valibot";
import { commentsTree, type CommentWithReplies } from "@/lib/comments";
import { cn, formatDate } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { Field, FieldError } from "./ui/field";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { Turnstile } from "./turnstile";
import { type Comment } from "@/lib/comments";
import { getTurnstileTokenFromForm } from "@/utils/security";

const CommentSchema = v.object({
	content: v.pipe(v.string("Content is required"), v.minLength(1, "Content is required")),
});

type CommentFormStore = FormStore<typeof CommentSchema>;

function loginHref(slug: string) {
	return `/auth/login?redirectTo=${encodeURIComponent(`/updates/${slug}`)}`;
}

function redirectToLogin(slug: string) {
	window.location.href = loginHref(slug);
}

function toFormData(values: Record<string, string | undefined>) {
	const formData = new FormData();

	for (const [key, value] of Object.entries(values)) {
		if (value !== undefined) {
			formData.append(key, value);
		}
	}

	return formData;
}

function ContentInteractionsCountFallback() {
	return (
		<div class="flex items-center justify-between mb-12">
			<div class="flex items-center gap-6">
				<div class="flex items-center gap-2">
					<HeartIcon class="size-6" />
					<Skeleton class="h-4 w-10" />
				</div>
				<div class="flex items-center gap-2">
					<MessageSquareIcon class="size-6 text-foreground/40" />
					<Skeleton class="h-4 w-10" />
				</div>
			</div>
		</div>
	);
}

function ContentDiscussionsFallback() {
	return (
		<div>
			<h3 class="font-serif text-3xl mb-8">Discussion.</h3>

			<span class="block text-xxs font-mono uppercase tracking-widest text-foreground/40 mb-4">
				Post a comment
			</span>

			<div class="relative">
				<Textarea
					placeholder="Add to the discussion..."
					class="min-h-24 rounded-none mb-8"
					disabled
				/>

				<Button
					type="submit"
					class="absolute bottom-3 right-3 p-1.5"
					variant="ghost"
					size="icon"
					disabled
				>
					<SendIcon class="size-3.5" />
				</Button>
			</div>

			<div class="space-y-6">
				<For each={Array.from({ length: 4 })}>
					{() => (
						<div class="border border-border p-4">
							<div class="flex items-center justify-between">
								<Skeleton class="h-4 w-24" />
								<Skeleton class="h-4 w-18" />
							</div>
							<Skeleton class="h-12 w-full my-2" />
							<Skeleton class="h-4 w-18" />
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

interface CommentFieldProps {
	form: CommentFormStore;
	placeholder: string;
	error?: string;
	submitting: boolean;
}

function CommentField(props: CommentFieldProps) {
	return (
		<FormField of={props.form} path={["content"]}>
			{(field) => {
				const isInvalid = () => field.isTouched && !field.isValid;

				return (
					<Field data-invalid={isInvalid()}>
						<div class="relative">
							<Textarea
								placeholder={props.placeholder}
								class="min-h-24 rounded-none"
								id="content"
								{...field.props}
								value={field.input}
								aria-invalid={isInvalid()}
								onKeyDown={(e) => {
									if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
										e.currentTarget.form?.requestSubmit();
									}
								}}
							/>
							<Button
								type="submit"
								class="absolute bottom-3 right-3 p-1.5"
								variant="ghost"
								size="icon"
								disabled={props.submitting}
							>
								<Show when={props.submitting} fallback={<SendIcon class="size-3.5" />}>
									<Spinner class="size-3.5" />
								</Show>
							</Button>
						</div>
						<Show when={isInvalid()}>
							<FieldError errors={field.errors} />
						</Show>
						<Show when={props.error}>
							<FieldError errors={[props.error as string]} />
						</Show>
					</Field>
				);
			}}
		</FormField>
	);
}

interface CommentFormProps {
	slug: string;
	onPosted: () => void;
}

function CommentForm(props: CommentFormProps) {
	const form = createForm({ schema: CommentSchema });
	const [error, setError] = createSignal<string>();
	let resetTurnstile: (() => void) | undefined;

	const onSubmit = async (output: v.InferOutput<typeof CommentSchema>, event: SubmitEvent) => {
		setError(undefined);

		const token = getTurnstileTokenFromForm(event);
		if (!token) {
			setError("Turnstile verification failed. Please try again.");
			return;
		}

		const { error: actionError } = await actions.addComment(
			toFormData({
				slug: props.slug,
				content: output.content,
				turnstileToken: token,
			})
		);

		resetTurnstile?.();

		if (actionError) {
			if (actionError.code === "UNAUTHORIZED") {
				redirectToLogin(props.slug);
				return;
			}

			setError(actionError.message);
			return;
		}

		reset(form);
		props.onPosted();
	};

	return (
		<Form of={form} onSubmit={onSubmit} class="mt-4">
			<CommentField
				form={form}
				placeholder="Add to the discussion..."
				submitting={form.isSubmitting}
				error={error()}
			/>

			<Turnstile class="mt-4" registerReset={(reset) => (resetTurnstile = reset)} />
		</Form>
	);
}

interface ReplyFormProps {
	slug: string;
	parentId: string;
	placeholder: string;
	onPosted: () => void;
}

function ReplyForm(props: ReplyFormProps) {
	const form = createForm({ schema: CommentSchema });
	const [error, setError] = createSignal<string>();
	let resetTurnstile: (() => void) | undefined;

	const onSubmit = async (output: v.InferOutput<typeof CommentSchema>, event: SubmitEvent) => {
		setError(undefined);

		const token = getTurnstileTokenFromForm(event);
		if (!token) {
			setError("Turnstile verification failed. Please try again.");
			return;
		}

		const { error: actionError } = await actions.addComment(
			toFormData({
				slug: props.slug,
				parentId: props.parentId,
				content: output.content,
				turnstileToken: token,
			})
		);

		resetTurnstile?.();

		if (actionError) {
			if (actionError.code === "UNAUTHORIZED") {
				redirectToLogin(props.slug);
				return;
			}

			setError(actionError.message);
			return;
		}

		reset(form);
		props.onPosted();
	};

	return (
		<Form of={form} onSubmit={onSubmit} class="mt-4">
			<CommentField
				form={form}
				placeholder={props.placeholder}
				submitting={form.isSubmitting}
				error={error()}
			/>

			<Turnstile class="mt-4" registerReset={(reset) => (resetTurnstile = reset)} />
		</Form>
	);
}

interface ContentCommentProps {
	comment: CommentWithReplies;
	userId?: string;
	slug: string;
	replyingTo?: string;
	onToggleReply: (id?: string) => void;
	onPosted: () => void;
}

const ContentComment: Component<ContentCommentProps> = (props) => {
	const isReplying = () => props.replyingTo === props.comment.id;

	return (
		<div
			id={`comment-${props.comment.id}`}
			class={cn("border border-border p-4 target:outline scroll-mt-32", {
				"p-4 border-r-0 border-y-0 border-l border-l-foreground/30": props.comment.rootId,
			})}
		>
			<div class="flex justify-between items-baseline mb-2">
				<div class="flex items-center gap-2">
					<span class="font-bold text-sm">
						{props.comment.user.name || props.comment.user.email}
					</span>
					<Show when={props.comment.parent?.user}>
						<a
							href={`#comment-${props.comment.parentId}`}
							class="text-foreground/50 flex items-center gap-2"
						>
							<Reply class="size-3 rotate-180" />
							<span class="uppercase font-mono text-xxs">
								Replied to {props.comment.parent?.user?.name || props.comment.parent?.user?.email}
							</span>
						</a>
					</Show>
				</div>
				<span class="text-xxs text-foreground/40 font-mono uppercase tracking-widest">
					{formatDate(new Date(props.comment.createdAt))}
				</span>
			</div>
			<p class="font-normal leading-relaxed">{props.comment.content}</p>

			<div class="mt-2 flex gap-4">
				<Button
					onClick={() => {
						if (props.comment.status !== "published") return;

						if (props.userId) {
							props.onToggleReply(isReplying() ? undefined : props.comment.id);
							return;
						}

						redirectToLogin(props.slug);
					}}
					type="button"
					variant="ghost"
					size="sm"
					class="text-foreground/40 p-0! h-auto hover:bg-transparent"
					disabled={props.comment.status !== "published"}
				>
					<Show when={isReplying()} fallback={<ReplyIcon class="size-3" />}>
						<XIcon class="size-3" />
					</Show>
					{isReplying() ? "Cancel" : "Reply"}
				</Button>
			</div>

			<Show when={isReplying()}>
				<ReplyForm
					slug={props.slug}
					parentId={props.comment.id}
					placeholder={`Replying to ${props.comment.user.name}...`}
					onPosted={() => {
						props.onToggleReply(undefined);
						props.onPosted();
					}}
				/>
			</Show>

			<Show when={props.comment.replies.length > 0}>
				<div class="space-y-6 mt-6 bg-background relative z-10">
					<For each={props.comment.replies}>
						{(reply) => (
							<ContentComment
								comment={reply}
								userId={props.userId}
								slug={props.slug}
								replyingTo={props.replyingTo}
								onToggleReply={props.onToggleReply}
								onPosted={props.onPosted}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
};

interface ContentInteractionsProps {
	slug: string;
}

type LikesData = { totalCount: number; isLiked: boolean };
type CommentsData = { comments: Comment[]; count: number; userId: string | null };

export function ContentInteractions(props: ContentInteractionsProps) {
	const [likes, setLikes] = createSignal<LikesData>();
	const [comments, setComments] = createSignal<CommentsData>();
	const [replyingTo, setReplyingTo] = createSignal<string>();
	const [likeError, setLikeError] = createSignal<string>();

	const fetchLikes = async () => {
		const { data, error } = await actions.getUpdateLikes({ slug: props.slug });

		setLikes(error ? { totalCount: 0, isLiked: false } : data);
	};

	const fetchComments = async () => {
		const { data, error } = await actions.getUpdateComments({ slug: props.slug });

		if (!error) {
			setComments(data);
		}
	};

	onMount(() => {
		fetchLikes();
		fetchComments();
	});

	const onLike = async () => {
		setLikeError(undefined);

		const previous = likes();

		if (previous) {
			setLikes(
				previous.isLiked
					? { isLiked: false, totalCount: Math.max(0, previous.totalCount - 1) }
					: { isLiked: true, totalCount: previous.totalCount + 1 }
			);
		}

		const { error } = await actions.toggleUpdateLike(toFormData({ slug: props.slug }));

		if (error) {
			if (error.code === "UNAUTHORIZED") {
				redirectToLogin(props.slug);
				return;
			}

			setLikeError(error.message);
		}

		await fetchLikes();
	};

	return (
		<div class="mt-24 pt-12 border-t border-border">
			<Show when={likes() && comments()} fallback={<ContentInteractionsCountFallback />}>
				<div class="flex items-center justify-between mb-12">
					<div class="flex items-center gap-6">
						<button
							class="flex items-center gap-2 transition-colors group cursor-pointer"
							type="button"
							onClick={onLike}
						>
							<HeartIcon
								class={cn("size-6 group-hover:scale-110 duration-300", {
									"fill-red-600 text-red-600": likes()?.isLiked,
								})}
							/>
							<span class="text-xs font-mono font-bold">{likes()?.totalCount ?? 0}</span>
						</button>
						<div class="flex items-center gap-2 text-foreground/40">
							<MessageSquareIcon class="size-6" />
							<span class="text-xs font-mono font-bold">{comments()?.count ?? 0}</span>
						</div>
					</div>
				</div>
				<Show when={likeError()}>
					<p class="text-destructive text-sm font-normal -mt-8 mb-12">{likeError()}</p>
				</Show>
			</Show>

			<Show when={comments()} fallback={<ContentDiscussionsFallback />}>
				<div>
					<h3 class="font-serif text-3xl mb-8">Discussion.</h3>

					<Show when={comments()?.userId}>
						<div class="mb-8">
							<span class="block text-xxs font-mono uppercase tracking-widest text-foreground/40 mb-4">
								Post a comment
							</span>
							<CommentForm slug={props.slug} onPosted={fetchComments} />
						</div>
					</Show>
					<Show when={!comments()?.userId}>
						<div class="p-8 text-center border border-border border-dashed rounded-lg mb-8">
							<p class="text-foreground/50 text-sm mb-6">
								You must be logged in to participate in the discussion.
							</p>
							<a href={loginHref(props.slug)} class={buttonVariants({ size: "lg" })}>
								Login to Account
							</a>
						</div>
					</Show>

					<div class="space-y-6 mb-12">
						<Show
							when={(comments()?.comments.length ?? 0) > 0}
							fallback={
								<p class="text-foreground/40 italic text-sm font-normal">
									No thoughts shared yet. Be the first to start the conversation.
								</p>
							}
						>
							<For each={commentsTree(comments()?.comments ?? [])}>
								{(comment) => (
									<ContentComment
										comment={comment}
										userId={comments()?.userId ?? undefined}
										slug={props.slug}
										replyingTo={replyingTo()}
										onToggleReply={setReplyingTo}
										onPosted={fetchComments}
									/>
								)}
							</For>
						</Show>
					</div>
				</div>
			</Show>
		</div>
	);
}
