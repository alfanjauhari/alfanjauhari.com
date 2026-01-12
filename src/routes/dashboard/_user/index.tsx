import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { HeartIcon, MessageSquareIcon } from "lucide-react";
import { type FocusEvent, type KeyboardEvent, Suspense } from "react";
import { toast } from "sonner";
import { LogoutButton } from "@/components/logout-button";
import { clientEnv } from "@/env/client";
import { getUserCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { getUserLikesQueryOptions } from "@/fns/polymorphic/likes";
import { updateUserNameServerFn } from "@/fns/polymorphic/users";
import { seoHead } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { CommentsList } from "./-comments-list";
import { LikesList } from "./-likes-list";
import { ListFeedback } from "./-list-fallback";

export const Route = createFileRoute("/dashboard/_user/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(getUserCommentsQueryOptions());
    context.queryClient.prefetchQuery(getUserLikesQueryOptions());
  },
  head: () =>
    seoHead({
      title: "Dashboard",
      description:
        "Manage your account, likes and comments in one single place.",
      canonical: "/dashboard",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/home.webp`,
    }),
});

function RouteComponent() {
  const { user } = Route.useRouteContext();

  const updateNameMutation = useMutation({
    mutationFn: updateUserNameServerFn,
  });

  const onNameBlur = async (e: FocusEvent<HTMLSpanElement>) => {
    const value = e.target.textContent;
    if (value === user.name || (!user.name && value === "John Doe")) {
      return;
    }

    const result = await updateNameMutation.mutateAsync({
      data: value,
    });

    if (typeof result === "boolean") {
      toast.success("Name updated successfully");
    } else {
      toast.error(result);
    }
  };

  const onNameKeyDown = async (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = e.currentTarget.textContent;

      if (value === user.name || (!user.name && value === "John Doe")) {
        return e.currentTarget.blur();
      }

      e.currentTarget.blur();
    }
  };

  return (
    <>
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-5xl mb-4">
            Hello,{" "}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: Only for update name */}
            <span
              contentEditable="plaintext-only"
              suppressContentEditableWarning
              onBlur={onNameBlur}
              onKeyDown={onNameKeyDown}
              spellCheck={false}
              className="underline"
            >
              {user.name || "John Doe"}
            </span>
            !
          </h1>
          <p className="font-mono text-sm text-foreground/50">
            Member since {formatDate(user.createdAt)}
          </p>
        </div>

        <LogoutButton />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        <Suspense
          fallback={
            <ListFeedback>
              <HeartIcon className="size-6" />
              <span>Likes History</span>
            </ListFeedback>
          }
        >
          <LikesList />
        </Suspense>
        <Suspense
          fallback={
            <ListFeedback>
              <MessageSquareIcon className="size-6" />
              <span>Comment History</span>
            </ListFeedback>
          }
        >
          <CommentsList />
        </Suspense>
      </section>
    </>
  );
}
