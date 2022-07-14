import fs from 'fs';
import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import rehypePrism from 'rehype-prism-plus';

export type FileType = 'posts' | 'pages';

const contentsDir = (...otherPath: string[]) => {
  return path.join(process.cwd(), 'contents', ...otherPath);
};

export function getFiles(fileType: FileType): string[] {
  return fs.readdirSync(contentsDir(fileType));
}

export type GetFileBySlugType = {
  mdx: Omit<Awaited<ReturnType<typeof bundleMDX>>, 'frontmatter'>;
  frontMatter: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    slug: string;
  };
};

export async function getFileBySlug(
  fileType: FileType,
  slug: string,
): Promise<GetFileBySlugType> {
  const { frontmatter, ...mdx } = await bundleMDX({
    file: contentsDir(fileType, `${slug}.mdx`),
    mdxOptions: (options) => ({
      ...options,
      rehypePlugins: [...(options.rehypePlugins ?? []), rehypePrism],
    }),
  });

  return {
    mdx,
    frontMatter: {
      ...frontmatter,
      slug,
    },
  };
}

export async function getArticles() {
  const articles = getFiles('posts');

  return Promise.all(
    articles.map(async (article) => {
      const { frontmatter } = await bundleMDX({
        file: contentsDir('posts', article),
        cwd: contentsDir('posts'),
      });
      const slug = article.replace(/\.mdx/, '');

      return {
        ...frontmatter,
        slug,
      };
    }),
  );
}

export async function getPages() {
  const pages = getFiles('pages');

  return Promise.all(
    pages.map(async (page) => {
      const { frontmatter } = await bundleMDX({
        file: contentsDir('pages', page),
        cwd: contentsDir('pages'),
      });
      const slug = page.replace(/\.mdx/, '');

      return {
        ...frontmatter,
        slug,
      };
    }),
  );
}
