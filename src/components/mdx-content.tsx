import { MDXContent as Content } from "@content-collections/mdx/react";
import { Image } from "@unpic/react";
import type { ComponentProps } from "react";
import { Sandpack } from "./sandpack";
import Pre from "./ui/pre";

export function MDXContent({
  code,
  components,
}: ComponentProps<typeof Content>) {
  return (
    <Content
      code={code}
      components={{
        pre: Pre,
        img: Image,
        Sandpack,
        ...components,
      }}
    />
  );
}
