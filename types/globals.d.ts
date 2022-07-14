export {};

declare global {
  type Overwrite<T, R> = Omit<T, keyof R> & R;

  type PostType = {
    title: string;
    description: string;
    excerpt: string;
    thumbnail: string;
    category: string;
    publishedAt: string;
    slug: string;
  };
}
