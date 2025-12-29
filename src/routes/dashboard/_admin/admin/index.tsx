import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllCommentsQueryOptions } from "@/fns/polymorphic/comments";
import { getUpdatesQueryOptions } from "@/fns/polymorphic/updates";
import { CommentsList } from "./-comments-list";
import { ListFeedback } from "./-list-fallback";
import { UpdatesList } from "./-updates-list";

export const Route = createFileRoute("/dashboard/_admin/admin/")({
  component: RouteComponent,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(getUpdatesQueryOptions);
    context.queryClient.prefetchQuery(getAllCommentsQueryOptions);
  },
});

const TABS = [
  {
    label: "Updates",
    value: "updates",
  },
  {
    label: "Comments",
    value: "comments",
  },
];

function RouteComponent() {
  return (
    <>
      <div className="mb-12">
        <h1 className="font-serif text-5xl mb-4">Overview</h1>
        <p className="text-foreground/60 font-normal leading-relaxed">
          Manage content, moderate discussions, and configure platform settings.
        </p>
      </div>
      <Tabs defaultValue="updates">
        <TabsList className="bg-background border-b border-b-accent p-0 h-auto w-full block">
          {TABS.map((tab) => (
            <TabsTrigger
              value={tab.value}
              className="data-[state=active]:border-b-2 data-[state=active]:border-b-foreground! mr-2 last:mr-0"
              key={tab.value}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="updates" className="py-12">
          <Suspense fallback={<ListFeedback />}>
            <UpdatesList />
          </Suspense>
        </TabsContent>
        <TabsContent value="comments" className="py-12">
          <Suspense fallback={<ListFeedback />}>
            <CommentsList />
          </Suspense>
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
}
