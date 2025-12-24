import { getSandpackCssText } from "@codesandbox/sandpack-react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactLenis } from "lenis/react";
import { AnimatePresence } from "motion/react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Loader } from "@/components/loader";
import { ThemeProvider } from "@/context/theme-context";
import { clientEnv } from "@/env/client";
import type { RouterContext } from "@/router-context";
import appCss from "../assets/styles.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: `${clientEnv.VITE_CLOUDINARY_URL}/favicons/apple-touch-icon.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `${clientEnv.VITE_CLOUDINARY_URL}/favicons/favicon-32x32.png`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `${clientEnv.VITE_CLOUDINARY_URL}/favicons/favicon-16x16.png`,
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      {
        rel: "icon",
        href: `${clientEnv.VITE_CLOUDINARY_URL}/favicons/favicon.ico`,
      },
    ],
    styles: [
      {
        dangerouslySetInnerHTML: {
          __html: getSandpackCssText(),
        },
        id: "sandpack",
      },
    ],
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
  }),
  shellComponent: RootDocument,
  loader: () => {
    return {
      timeNow: Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    };
  },
  scripts: () => [
    {
      src: "https://analytics.alfanjauhari.com/script.js",
      defer: true,
      "data-website-id": "105608de-4851-470d-8cf4-f844b4d8a295",
    },
  ],
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  return (
    <ReactLenis root>
      <html
        className="scroll-smooth group/root"
        lang="en"
        suppressHydrationWarning
      >
        <head>
          <HeadContent />
        </head>
        <body className="relative min-h-screen flex flex-col">
          <ThemeProvider>
            <AnimatePresence mode="wait">
              <Loader key="loader" />
            </AnimatePresence>
            <Header />
            <div className="grow px-6 md:px-12 mx-auto relative w-full z-10 bg-background origin-top rounded-b-[3rem] mb-[500px] md:mb-[600px]">
              <main className="max-w-7xl mx-auto mb-32">{children}</main>
            </div>
            <Footer />
            <TanStackDevtools
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: "Tanstack Query",
                  render: <ReactQueryDevtoolsPanel client={queryClient} />,
                },
              ]}
            />
          </ThemeProvider>
          <Scripts />
        </body>
      </html>
    </ReactLenis>
  );
}
