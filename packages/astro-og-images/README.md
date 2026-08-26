# @alfanjauhari/astro-og-images

Generate Open Graph images from the metadata in prerendered Astro pages.

The integration runs after `astro build`, renders each page's image with
[Takumi](https://github.com/kane50613/takumi), and writes the image beside the generated HTML file. It is build-time Node.js code, not an image endpoint for runtime-rendered pages.

## Requirements

- Node.js 24.19 or newer
- Astro 7.2 or newer
- Static pages, or individual routes that Astro prerenders
- A configured Astro `site` URL

## Installation

```sh
pnpm add @alfanjauhari/astro-og-images
```

## Quick Start

Add the integration to `astro.config.mjs`. Set `format` explicitly and use the same format when generating the metadata URL.

```js
import ogImages, { element } from "@alfanjauhari/astro-og-images";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    ogImages({
      format: "webp",
      width: 1200,
      height: 630,
      fonts: [],
      render: ({ description, title }) =>
        element(
          "div",
          {
            tw: "flex h-full w-full flex-col justify-center bg-white px-20 text-black",
          },
          element("h1", { tw: "text-6xl font-bold" }, title),
          description && element("p", { tw: "mt-6 text-2xl" }, description),
        ), // or you can use jsx such as `<div tw="bg-black">Hello</div>`,
    }),
  ],
});
```

Then emit matching Open Graph metadata from a layout or head component:

```astro
---
import { getOgImagePath } from "@alfanjauhari/astro-og-images/path";

const title = "Page title";
const description = "Page description";
const canonicalUrl = new URL(Astro.url.pathname, Astro.site).toString();
const image = getOgImagePath({
  format: "webp",
  site: Astro.site,
  url: Astro.url,
});
---

<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content="website" />
<meta property="og:image" content={image} />
```

Every generated page must contain `og:title`, `og:url`, `og:type`, and `og:image`. `og:description` is optional. Standard `<title>`, description, or Twitter tags are not used as fallbacks.

## How It Works

During `astro:build:done`, the integration:

1. Finds the HTML output for each Astro page.
2. Extracts its Open Graph metadata.
3. Calls `render` with the metadata and page pathname.
4. Passes the returned element tree and rendering options to Takumi.
5. Writes the image beside the HTML output.
6. Fails the build if the generated path does not match `og:image`.

Pages without generated HTML are skipped. This includes routes with `export const prerender = false`.

## Output Paths

`getOgImagePath()` mirrors Astro's output path rules:

| Page URL     | Image path          |
| ------------ | ------------------- |
| `/`          | `/index.webp`       |
| `/about`     | `/about.webp`       |
| `/about/`    | `/about/index.webp` |
| `/page.html` | `/page.html.webp`   |
| `/404/`      | `/404.webp`         |
| `/500/`      | `/500.webp`         |

The helper defaults to WebP, but the integration currently requires an explicit `format`. The helper and integration formats must match.

## API

### Default Integration

```ts
import ogImages from "@alfanjauhari/astro-og-images";
```

`ogImages(options)` accepts Takumi `RenderOptions` plus:

| Option    | Type                                                            | Description                                |
| --------- | --------------------------------------------------------------- | ------------------------------------------ |
| `render`  | `(input: OgRenderInput) => RenderInput \| Promise<RenderInput>` | Creates the Takumi render tree for a page. |
| `verbose` | `boolean`                                                       | Logs every generated image when enabled.   |

The render input contains `title`, optional `description`, `url`, `type`, `image`, and `pathname`.

### `element()`

```ts
import { element } from "@alfanjauhari/astro-og-images";
```

Creates a React-element-like object understood by Takumi without requiring React at runtime. It supports intrinsic HTML props, children, inline styles, and Takumi's `tw` utility property.

### `getOgImagePath()`

```ts
import { getOgImagePath } from "@alfanjauhari/astro-og-images/path";
```

Returns the absolute image URL for an Astro page. It throws when Astro's `site` option is missing.

### Other Exports

The root entry also exports `extractOgMetadata`, its related package types, Takumi render types, and the exports from `@takumi-rs/core` for advanced rendering needs.

## Notes

- Rendering uses Node.js filesystem APIs and Takumi's native bindings during the build.
- Missing required metadata, render failures, write failures, or path mismatches fail the Astro build.
- Images are generated concurrently for all prerendered pages. Account for memory use on large sites or complex templates.
- Register custom fonts through Takumi's `fonts` and `fontFamilies` render options.

## Development

From the monorepo root:

```sh
pnpm --filter @alfanjauhari/astro-og-images build
pnpm --filter @alfanjauhari/astro-og-images typecheck
```

This package is licensed under the [MIT License](./LICENSE).
