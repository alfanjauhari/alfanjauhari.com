# @alfanjauhari/astro-og-images

An Astro build integration that renders Open Graph images from the metadata in prerendered HTML pages.

The integration runs during `astro:build:done` and requires Node.js filesystem access plus the native Takumi renderer. It is intended for static or prerendered pages, not runtime Worker rendering.

```ts
import ogImages, { element } from "@alfanjauhari/astro-og-images";

export default {
  integrations: [
    ogImages({
      fonts: [],
      render: ({ title }) => element("div", {}, title), // or <div className="bg-accent">Hello</div>,
    }),
  ],
};
```

Use `@alfanjauhari/astro-og-images/path` to generate the matching `og:image` URL in an Astro component.
