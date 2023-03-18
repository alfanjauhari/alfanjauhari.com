import { Button, SEO } from '@/components';
import { PostCard } from '@/components/post-card';
import { MainLayout } from '@/layouts';
import { styled } from '@/theme';
import { omit } from '@/utils';
import { allPosts, Post } from '@contentlayer/generated';
import { compareDesc, format } from 'date-fns';
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next';
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

type OmittedPost = Omit<Post, '_id' | '_raw' | 'body' | 'category' | 'type'>;

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{
    posts: Omit<Post, '_id' | '_raw' | 'body' | 'category' | 'type'>[];
  }>
> {
  const posts = allPosts
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
    .map(({ date, ...post }) => ({
      ...omit(post, ['_id', '_raw', 'body', 'category', 'type']),
      date: format(new Date(date), 'dd LLLL yyyy'),
    }));

  return {
    props: {
      posts,
    },
  };
}

export default function Blog({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const POSTS_PER_PAGE = 4;

  const [nextPosts, setNextPosts] = useState(2);
  const [currentPosts, setCurrentPosts] = useState<OmittedPost[]>([]);

  const slicePost = useCallback(
    (start: number, end: number) => {
      const slicedPosts = posts.slice(start, end);

      setCurrentPosts((prevPosts) => [...prevPosts, ...slicedPosts]);
    },
    [posts],
  );

  const loadMore = () => {
    slicePost(nextPosts, nextPosts + POSTS_PER_PAGE);
    setNextPosts((prevPosts) => prevPosts + POSTS_PER_PAGE);
  };

  useEffect(() => {
    setCurrentPosts([]);
    setNextPosts(2);
    slicePost(0, POSTS_PER_PAGE);
  }, [slicePost]);

  return (
    <MainLayout>
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
        {posts.length > 0 ? (
          <article className="articles-list">
            {currentPosts.map((post) => (
              <PostCard
                title={post.title}
                excerpt={post.excerpt}
                thumbnail={post.thumbnail}
                slug={`/blog/${post.slug}`}
                publishedAt={post.date}
                key={post.slug}
              />
            ))}
          </article>
        ) : (
          <h1 className="not-found-message">
            Articles not found. Maybe i&lsquo;m so lazy to make an article :p
          </h1>
        )}
        {posts.length > POSTS_PER_PAGE &&
          posts.length !== currentPosts.length && (
            <div className="load-more-wrapper">
              <Button variant="primary" size="lg" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
      </StyledArticles>
    </MainLayout>
  );
}
