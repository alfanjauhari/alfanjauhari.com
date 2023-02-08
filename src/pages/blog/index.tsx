import { Button, SEO } from '@/components';
import { PostCard } from '@/components/post-card';
import { styled } from '@/theme';
import { getArticles } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

// #region Styled
const StyledArticles = styled('section', {
  my: '64px',
  '@md': {
    my: '112px',
  },
  '& div.title-description-wrapper': {
    borderBottom: '1px',
    borderColor: '$gray2',
    borderStyle: 'solid',
    pb: '$6',
    '& h1.title': {
      fontWeight: 'bold',
      fontSize: '48px',
      lineHeight: 1,
      width: '100%',
      '@md': {
        fontSize: '60px',
      },
      '@lg': {
        fontSize: '72px',
      },
    },
    '& h2.description': {
      color: '$gray5',
      fontSize: '$xxl',
      mt: '$6',
    },
  },
  '& article.articles-list': {
    mt: '$8',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '$8',
    '@md': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  '& h1.not-found-message': {
    fontSize: '$xxl',
    mt: '$4',
    color: '$gray4',
  },
  '& div.load-more-wrapper': {
    mt: '$8',
    width: '100%',
  },
});
// #endregion Styled

export type BlogProps = {
  articles: PostType[];
};

export default function Blog({ articles }: BlogProps) {
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
      <StyledArticles id="articles">
        <div className="title-description-wrapper">
          <h1 className="title">Blog</h1>
          <h2 className="description">
            Some of my writings are about of technology, programming, and random
            things.
          </h2>
        </div>
        {articles.length > 0 ? (
          <article className="articles-list">
            {currentArticles.map((frontMatter) => (
              <PostCard
                title={frontMatter.title}
                excerpt={frontMatter.excerpt}
                thumbnail={frontMatter.thumbnail}
                slug={`/blog/${frontMatter.slug}`}
                publishedAt={frontMatter.publishedAt}
                key={frontMatter.slug}
              />
            ))}
          </article>
        ) : (
          <h1 className="not-found-message">
            Articles not found. Maybe i&lsquo;m so lazy to make an article :p
          </h1>
        )}
        {articles.length > postsPerPage &&
          articles.length !== currentArticles.length && (
            <div className="load-more-wrapper">
              <Button variant="primary" size="lg" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
      </StyledArticles>
    </>
  );
}

export async function getStaticProps() {
  const articles: PostType[] = (await getArticles()) as PostType[];
  const sortedArticles = articles.sort(
    (a, b) => Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
  );

  return {
    props: {
      articles: sortedArticles,
    },
  };
}
