import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { AnimatePresence } from "motion/react";
import { useCallback, useState } from "react";
import { Header } from "@/components/header";
import { Loader } from "@/components/loader";
import { ThemeProvider } from "@/context/theme-context";
import { setHasVisitedClient } from "@/fns/client/common";
import { getHasVisitedServer, getThemeServerFn } from "@/fns/server/common";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Alfan Jauhari",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  loader: async () => {
    return {
      hasVisited: await getHasVisitedServer(),
      theme: await getThemeServerFn(),
    };
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme, hasVisited } = Route.useLoaderData();

  const [loading, setLoading] = useState(!hasVisited);

  const onCompleteLoading = useCallback(async () => {
    setLoading(false);
    setHasVisitedClient(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <html className={theme} lang="en">
        <head>
          <HeadContent />
        </head>
        <body className="relative min-h-screen flex flex-col">
          <AnimatePresence mode="wait">
            {loading && <Loader onComplete={onCompleteLoading} key="loader" />}
          </AnimatePresence>
          <Header />
          <main className="grow px-6 md:px-12 max-w-7xl mx-auto relative w-full">
            {children}
          </main>
          <TanStackDevtools
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
          <Scripts />
        </body>
      </html>
    </ThemeProvider>
  );
}
