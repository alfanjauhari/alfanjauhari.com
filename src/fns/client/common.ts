import { createClientOnlyFn } from "@tanstack/react-start";

export const setHasVisited = createClientOnlyFn((visited: boolean) => {
  const html = document.documentElement;
  const hasAttribute = html.hasAttribute("data-has-visited");

  if (visited && !hasAttribute) {
    html.setAttribute("data-has-visited", String(visited));
  }

  localStorage.setItem("has-visited", String(visited));
});
