import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    defaultPendingMinMs: 0,
    context: {
      queryClient,
    },
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not found!</p>
        </div>
      );
    },
  });

  return router;
};
