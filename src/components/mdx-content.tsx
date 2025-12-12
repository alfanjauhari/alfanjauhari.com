import { MDXContent as Content } from "@content-collections/mdx/react";
import type { ComponentProps } from "react";
import { Image } from "./image";
import { Sandpack, SandpackFile } from "./sandpack";
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
        Image,
        Sandpack,
        SandpackFile,
        serif: (props) => <span className="font-serif" {...props} />,
        ...components,
      }}
    />
  );
}
