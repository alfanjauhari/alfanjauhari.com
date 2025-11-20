import { createClientOnlyFn } from "@tanstack/react-start";

export const getHasVisitedClient = createClientOnlyFn(() => {
  return document.cookie.includes("hasVisited=true");
});

export const setHasVisitedClient = createClientOnlyFn((hasVisited: boolean) => {
  // biome-ignore lint: Cookie setting requires direct assignment to document.cookie
  document.cookie = `hasVisited=${hasVisited ? "true" : "false"}; path=/; max-age=31536000`;
});

export const setTheme = createClientOnlyFn((theme: string) => {
  // biome-ignore lint: Cookie setting requires direct assignment to document.cookie
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
});
