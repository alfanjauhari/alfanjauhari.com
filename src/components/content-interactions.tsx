import { useForm } from "@tanstack/react-form";
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  isRedirect,
  Link,
  useMatch,
  useNavigate,
} from "@tanstack/react-router";
import {
  HeartIcon,
  MessageSquareIcon,
  Reply,
  ReplyIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import {
  createContext,
  type FormEvent,
  Suspense,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";
import z from "zod";
import {
  addCommentToUpdateMutationOptions,
  getUpdateCommentsQueryOptions,
} from "@/fns/polymorphic/comments";
import {
  getUpdateLikesMetadataQueryOptions,
  likeUpdateFn,
} from "@/fns/polymorphic/likes";
import { type CommentWithReplies, commentsTree } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";
import { Route } from "@/routes/__root";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent } from "./ui/collapsible";
import { Field, FieldError } from "./ui/field";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

const ContentInteractionsContext = createContext<
  "/updates/$updateId" | "/updates/r/$updateId" | undefined
>(undefined);

function useContentInteractionsContext() {
  const context = useContext(ContentInteractionsContext);

  if (!context) {
    throw new Error(
      "ContentInteractionsContext must be wrapped in ContentInteractionsContext.Provider",
    );
  }

  return context;
}

function ContentInteractionsCountFallback() {
  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <HeartIcon className="size-6" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-6 text-foreground/40" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
}

function ContentDiscussionsFallback() {
  return (
    <div>
      <h3 className="font-serif text-3xl mb-8">Discussion.</h3>

      <span className="block text-xxs font-mono uppercase tracking-widest text-foreground/40 mb-4">
        Post a comment
      </span>

      <div className="relative">
        <Textarea
          placeholder="Add to the discussion..."
          className="min-h-24 rounded-none mb-8"
          disabled
        />

        <Button
          type="submit"
          className="absolute bottom-3 right-3 p-1.5"
          variant="ghost"
          size="icon"
          disabled
        >
          <SendIcon className="size-3.5" />
        </Button>
      </div>

      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Only for static data
          <div className="border border-border p-4" key={i}>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-18" />
            </div>
            <Skeleton className="h-12 w-full my-2" />
            <Skeleton className="h-4 w-18" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentInteractionsCount() {
  const routeId = useContentInteractionsContext();

  const match = useMatch({
    from: routeId,
  });
  const navigate = useNavigate();

  const [
    { data },
    {
      data: { count: commentCount },
    },
  ] = useSuspenseQueries({
    queries: [
      getUpdateLikesMetadataQueryOptions(match.params.updateId),
      getUpdateCommentsQueryOptions(match.params.updateId),
    ],
  });

  const queryClient = useQueryClient();

  const metadataQueryOptions = getUpdateLikesMetadataQueryOptions(
    match.params.updateId,
  );
  const likeMutation = useMutation({
    mutationFn: likeUpdateFn,
    mutationKey: ["like-update", match.params.updateId],
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: metadataQueryOptions.queryKey,
      });

      const previousMetadata = queryClient.getQueryData(
        metadataQueryOptions.queryKey,
      );

      queryClient.setQueryData(metadataQueryOptions.queryKey, (old) => {
        if (!old) return old;

        if (old.isLiked)
          return {
            isLiked: false,
            totalCount: Math.max(0, old.totalCount - 1),
          };

        return {
          isLiked: true,
          totalCount: old.totalCount + 1,
        };
      });

      return {
        previousMetadata,
      };
    },
    onError: async (err, _newLike, context) => {
      queryClient.setQueryData(
        metadataQueryOptions.queryKey,
        context?.previousMetadata,
      );

      if (isRedirect(err)) {
        navigate({
          to: "/auth/login",
          search: {
            redirectTo:
              routeId === "/updates/$updateId"
                ? `/updates/${match.params.updateId}`
                : `/updates/r/${match.params.updateId}`,
          },
        });
      }
    },
    onSettled: () => {
      if (
        queryClient.isMutating({
          mutationKey: ["like-update", match.params.updateId],
        }) === 1
      ) {
        queryClient.invalidateQueries({
          queryKey: metadataQueryOptions.queryKey,
        });
      }
    },
  });

  const onLike = async () => {
    const likeData = await likeMutation.mutateAsync({
      data: {
        slug: match.params.updateId,
      },
    });

    if ("message" in likeData) {
      return toast.error(likeData.message);
    }
  };

  return (
    <div className="flex items-center justify-between mb-12">
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 transition-colors group cursor-pointer"
          type="button"
          onClick={onLike}
        >
          <HeartIcon
            className={cn("size-6 group-hover:scale-110 duration-300", {
              "fill-red-600 text-red-600": data.isLiked,
            })}
          />
          <span className="text-xs font-mono font-bold">{data.totalCount}</span>
        </button>
        <div className="flex items-center gap-2 text-foreground/40">
          <MessageSquareIcon className="size-6" />
          <span className="text-xs font-mono font-bold">{commentCount}</span>
        </div>
      </div>
    </div>
  );
}

const ReplySchema = z.object({
  slug: z.string(),
  parentId: z.nanoid(),
  content: z.string().min(1, "Content is required"),
});

function ContentComment({
  comment,
  userId,
}: {
  comment: CommentWithReplies;
  userId?: string;
}) {
  const routeId = useContentInteractionsContext();

  const navigate = useNavigate();
  const match = useMatch({
    from: routeId,
  });
  const queryClient = useQueryClient();

  const [replyingTo, setReplyingTo] = useState<string>();

  const replyMutation = useMutation(
    addCommentToUpdateMutationOptions(match.params.updateId),
  );

  const form = useForm({
    defaultValues: {
      parentId: replyingTo,
      content: "",
      slug: match.params.updateId,
    },
    validators: {
      onChange: ReplySchema,
    },
    onSubmit: async ({ value }) => {
      const result = await replyMutation.mutateAsync({
        data: value,
      });

      if ("id" in result) {
        await queryClient.invalidateQueries({
          queryKey: getUpdateCommentsQueryOptions(match.params.updateId)
            .queryKey,
        });

        setReplyingTo(undefined);

        return form.reset();
      }

      toast.error(result.message);
    },
  });

  const onReply = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit(e.target);
  };

  return (
    <div
      key={comment.id}
      id={`comment-${comment.id}`}
      className={cn("border border-border p-4 target:outline scroll-mt-32", {
        "p-4 border-r-0 border-y-0 border-l border-l-foreground/30":
          comment.rootId,
      })}
    >
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">{comment.user.name}</span>
          {comment.parent?.user && (
            <a
              href={`#comment-${comment.parentId}`}
              className="text-foreground/50 flex items-center gap-2"
            >
              <Reply className="size-3 rotate-180" />
              <span className="uppercase font-mono text-xxs">
                Replied to {comment.parent.user.name}
              </span>
            </a>
          )}
        </div>
        <span className="text-xxs text-foreground/40 font-mono uppercase tracking-widest">
          {formatDate(comment.createdAt)}
        </span>
      </div>
      <p className="font-normal leading-relaxed">{comment.content}</p>

      <div className="mt-2 flex gap-4">
        <Button
          onClick={() => {
            if (comment.status !== "published") return;

            if (userId) {
              return setReplyingTo((prevState) =>
                prevState === comment.id ? undefined : comment.id,
              );
            }

            navigate({
              to: "/auth/login",
              search: {
                redirectTo:
                  routeId === "/updates/$updateId"
                    ? `/updates/${match.params.updateId}`
                    : `/updates/r/${match.params.updateId}`,
              },
            });
          }}
          type="button"
          variant="ghost"
          size="sm"
          className="text-foreground/40 p-0! h-auto hover:bg-transparent"
          disabled={comment.status !== "published"}
        >
          {replyingTo === comment.id ? (
            <XIcon className="size-3" />
          ) : (
            <ReplyIcon className="size-3" />
          )}
          {replyingTo === comment.id ? "Cancel" : "Reply"}
        </Button>
      </div>

      <Collapsible open={!!replyingTo}>
        <CollapsibleContent>
          <form className="mt-4" onSubmit={onReply}>
            <form.Field name="content">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="relative">
                      <Textarea
                        placeholder={`Replying to ${comment.user.name}...`}
                        className="min-h-24 rounded-none"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        ref={(node) => {
                          if (!node) return;

                          node.addEventListener("keydown", (e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                              const form = (
                                e.currentTarget as HTMLTextAreaElement
                              ).closest("form");

                              if (!form) return;

                              form.requestSubmit();
                            }
                          });
                        }}
                      />
                      <form.Subscribe
                        selector={(formState) => formState.isSubmitting}
                      >
                        {(isSubmitting) => (
                          <Button
                            type="submit"
                            className="absolute bottom-3 right-3 p-1.5"
                            variant="ghost"
                            size="icon"
                          >
                            {isSubmitting ? (
                              <Spinner className="size-3.5" />
                            ) : (
                              <SendIcon className="size-3.5" />
                            )}
                          </Button>
                        )}
                      </form.Subscribe>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </form>
        </CollapsibleContent>
      </Collapsible>

      {comment.replies.length > 0 && (
        <div className="space-y-6 mt-6 bg-background relative z-10">
          {comment.replies.map((reply) => (
            <ContentComment key={reply.id} comment={reply} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContentDiscussions() {
  const routeId = useContentInteractionsContext();

  const match = useMatch({
    from: routeId,
  });
  const navigate = Route.useNavigate();

  const queryClient = useQueryClient();

  const addCommentMutation = useMutation(
    addCommentToUpdateMutationOptions(match.params.updateId),
  );

  const form = useForm({
    defaultValues: {
      content: "",
      slug: match.params.updateId,
    },
    validators: {
      onChange: ReplySchema.omit({
        parentId: true,
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await addCommentMutation.mutateAsync({
          data: value,
        });

        if ("id" in result) {
          await queryClient.invalidateQueries({
            queryKey: getUpdateCommentsQueryOptions(match.params.updateId)
              .queryKey,
          });

          return form.reset();
        }

        toast.error(result.message);
      } catch (err) {
        if (isRedirect(err)) {
          navigate({
            to: "/auth/login",
            search: {
              redirectTo:
                routeId === "/updates/$updateId"
                  ? `/updates/${match.params.updateId}`
                  : `/updates/r/${match.params.updateId}`,
            },
          });
        }
      }
    },
  });

  const {
    data: { comments, userId },
  } = useSuspenseQuery(getUpdateCommentsQueryOptions(match.params.updateId));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit(e.target);
  };

  return (
    <div>
      <h3 className="font-serif text-3xl mb-8">Discussion.</h3>

      {userId ? (
        <div className="mb-8">
          <span className="block text-xxs font-mono uppercase tracking-widest text-foreground/40 mb-4">
            Post a comment
          </span>
          <form className="mt-4" onSubmit={onSubmit}>
            <form.Field name="content">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="relative">
                      <Textarea
                        placeholder="Add to the discussion..."
                        className="min-h-24 rounded-none"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        ref={(node) => {
                          if (!node) return;

                          node.addEventListener("keydown", (e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                              const form = (
                                e.currentTarget as HTMLTextAreaElement
                              ).closest("form");

                              if (!form) return;

                              form.requestSubmit();
                            }
                          });
                        }}
                      />
                      <form.Subscribe
                        selector={(formState) => formState.isSubmitting}
                      >
                        {(isSubmitting) => (
                          <Button
                            type="submit"
                            className="absolute bottom-3 right-3 p-1.5"
                            variant="ghost"
                            size="icon"
                          >
                            {isSubmitting ? (
                              <Spinner className="size-3.5" />
                            ) : (
                              <SendIcon className="size-3.5" />
                            )}
                          </Button>
                        )}
                      </form.Subscribe>
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </form>
        </div>
      ) : (
        <div className="p-8 text-center border border-border border-dashed rounded-lg mb-8">
          <p className="text-foreground/50 text-sm mb-6">
            You must be logged in to participate in the discussion.
          </p>
          <Button asChild size="lg">
            <Link
              to="/auth/login"
              search={{
                redirectTo:
                  routeId === "/updates/$updateId"
                    ? `/updates/${match.params.updateId}`
                    : `/updates/r/${match.params.updateId}`,
              }}
            >
              Login to Account
            </Link>
          </Button>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-6 mb-12">
        {comments.length > 0 ? (
          commentsTree(comments).map((comment) => (
            <ContentComment
              key={comment.id}
              comment={comment}
              userId={userId}
            />
          ))
        ) : (
          <p className="text-foreground/40 italic text-sm font-normal">
            No thoughts shared yet. Be the first to start the conversation.
          </p>
        )}
      </div>
    </div>
  );
}

export function ContentInteractions({
  routeId,
}: {
  routeId: "/updates/$updateId" | "/updates/r/$updateId";
}) {
  return (
    <ContentInteractionsContext.Provider value={routeId}>
      <div className="mt-24 pt-12 border-t border-border">
        <Suspense fallback={<ContentInteractionsCountFallback />}>
          <ContentInteractionsCount />
        </Suspense>

        <Suspense fallback={<ContentDiscussionsFallback />}>
          <ContentDiscussions />
        </Suspense>
      </div>
    </ContentInteractionsContext.Provider>
  );
}
