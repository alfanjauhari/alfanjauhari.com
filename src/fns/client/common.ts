import { createIsomorphicFn } from "@tanstack/react-start";

export const setHasVisited = createIsomorphicFn().client((visited: boolean) => {
  const html = document.documentElement;
  const hasAttribute = html.hasAttribute("data-has-visited");

  if (visited && !hasAttribute) {
    html.setAttribute("data-has-visited", String(visited));
  }

  localStorage.setItem("has-visited", String(visited));
});
