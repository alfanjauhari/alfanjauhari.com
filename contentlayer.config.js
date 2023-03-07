import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `posts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the post. Used for SEO',
      required: true,
    },
    excerpt: {
      type: 'string',
      description: 'The excerpt of the post',
      required: true,
    },
    thumbnail: {
      // TODO Wait for contentlayer support image processing
      type: 'string',
      description: 'The thumbnail of the post',
      required: true,
    },
    category: {
      type: 'string',
      description: 'The category of the post',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: ({ _raw }) => _raw.flattenedPath.replace('posts/', ''),
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the page',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the page. Used for SEO',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: ({ _raw }) => _raw.flattenedPath.replace('pages/', ''),
    },
  },
}));

export const Thought = defineDocumentType(() => ({
  name: 'Thought',
  filePathPattern: `thoughts/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the thought',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the thought. Used for SEO',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the thought',
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: ({ _raw }) => _raw.flattenedPath.replace('thoughts/', ''),
    },
  },
}));

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post, Page, Thought],
  disableImportAliasWarning: true,
  mdx: {
    rehypePlugins: [rehypePrism],
    remarkPlugins: [remarkGfm],
  },
});
