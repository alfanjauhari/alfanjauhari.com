import { Button, SEO } from '@/components';
import { PostCard } from '@/components/post-card';
import { useCallback, useEffect, useState } from 'react';

export type BlogProps = {
  articles: PostType[];
};

export function Blog({ articles }: BlogProps) {
  const postsPerPage = 4;

  const [nextArticles, setNextArticles] = useState<number>(2);
  const [currentArticles, setCurrentArticles] = useState<PostType[]>([]);

  const sortedArticles = articles.sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  );

  const slicePost = useCallback(
    (start: number, end: number) => {
      const slicedArticles = sortedArticles.slice(start, end);

      setCurrentArticles((prevArticles) => [
        ...prevArticles,
        ...slicedArticles,
      ]);
    },
    [sortedArticles],
  );

  const loadMore = () => {
    slicePost(nextArticles, nextArticles + postsPerPage);
    setNextArticles((prevNextArticles) => prevNextArticles + postsPerPage);
  };

  useEffect(() => {
    setCurrentArticles([]);
    setNextArticles(2);
    slicePost(0, postsPerPage);
  }, [slicePost]);

  return (
    <>
      <SEO
        title="Blog"
        canonical="/blog"
        description="Some of my writings are about of technology, programming, and random things."
      />
      <section id="articles" className="my-16 md:my-28">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl w-full leading-none">
            Blog
          </h1>
          <h2 className="text-gray-500 text-2xl mt-6">
            Some of my writings are about of technology, programming, and random
            things.
          </h2>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap -mx-4">
          {articles.length > 0 ? (
            currentArticles.map((frontMatter) => (
              <PostCard
                title={frontMatter.title}
                excerpt={frontMatter.excerpt}
                thumbnail={frontMatter.thumbnail}
                slug={`/blog/${frontMatter.slug}`}
                publishedAt={frontMatter.publishedAt}
                className="w-full md:w-1/2 px-4 mt-6"
                key={frontMatter.slug}
              />
            ))
          ) : (
            <h1 className="text-2xl text-gray-400 mt-4">
              Articles not found. Maybe i&lsquo;m so lazy to make an article :p
            </h1>
          )}
          {articles.length > postsPerPage &&
            articles.length !== currentArticles.length && (
              <Button
                className="my-6 w-1/3 font-semibold"
                variant="primary"
                size="lg"
                onClick={loadMore}
              >
                Load More
              </Button>
            )}
        </div>
      </section>
    </>
  );
}
