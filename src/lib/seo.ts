import type { AnyRouteMatch } from "@tanstack/react-router";
import { clientEnv } from "@/env/client";

export interface SEOHeadParams {
  title?: string;
  description: string;
  image?: string;
  canonical: string;
  meta?: AnyRouteMatch["meta"];
  links?: AnyRouteMatch["links"];
}

export const seoHead = ({
  title: titleProp,
  description,
  image,
  canonical,
  links,
  meta,
}: SEOHeadParams): {
  meta: AnyRouteMatch["meta"];
  links: AnyRouteMatch["links"];
} => {
  const title = titleProp ? `${titleProp} — Alfan Jauhari` : "Alfan Jauhari";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:creator", content: "@alfanjauhari_" },
      { name: "twitter:site", content: "@alfanjauhari_" },
      { property: "twitter:url", content: clientEnv.VITE_SITE_URL + canonical },
      {
        property: "twitter:domain",
        content: new URL(clientEnv.VITE_SITE_URL).host,
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      ...(image
        ? [
            {
              name: "twitter:image",
              content: image.startsWith("http")
                ? image
                : `${clientEnv.VITE_SITE_URL}${image}`,
            },
            { name: "twitter:card", content: "summary_large_image" },
            {
              property: "og:image",
              content: image.startsWith("http")
                ? image
                : `${clientEnv.VITE_SITE_URL}${image}`,
            },
          ]
        : []),
      ...(meta || []),
    ],
    links: [
      {
        rel: "canonical",
        href: clientEnv.VITE_SITE_URL + canonical,
      },
      ...(links || []),
    ],
  };
};
