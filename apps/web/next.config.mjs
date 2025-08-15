import { withContentCollections } from "@content-collections/next";
import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["tsx", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "github-light",
          wrap: true,
        },
      ],
    ],
  },
});

export default withContentCollections(withMDX(nextConfig));
