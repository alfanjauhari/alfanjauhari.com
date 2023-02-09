import { MDXComponent, SEO } from '@/components';
import { profile } from '@/configs';
import { styled } from '@/theme';
import { allPosts, Post } from '@contentlayer/generated';
import { format } from 'date-fns';
import {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { useRef } from 'react';
import readTime from 'reading-time';

// #region Styled
const StyledWrapper = styled('div', {
  my: '64px',
  '@md': {
    my: '112px',
  },
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
  '& h2.excerpt': {
    color: '$gray5',
    fontSize: '$xxl',
    mt: '$6',
  },
  '& div.date-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderTopWidth: '1px',
    borderBottomWidth: '1px',
    borderColor: '$gray2',
    py: '$4',
    mt: '$6',
    '@md': {
      flexDirection: 'row',
      alignItems: 'center',
    },
    '& p.reading-time': {
      color: '$gray5',
      mt: '$2',
      '@md': {
        mt: 0,
      },
    },
  },
  '& div.article-wrapper': {
    mt: '$6',
  },
  '& div.sharer-wrapper': {
    mt: '$6',
    borderTop: '1px solid $colors$gray3',
    pt: '$6',
    '& ul.sharer-lists': {
      display: 'flex',
      '& li.sharer-item': {
        mr: '$3',
        '& a.sharer-link': {
          color: '$blue6',
          fontSize: '$sm',
          '@md': {
            fontSize: '$md',
          },
          '&:hover': {
            color: '$blue8',
            transitionDuration: '300ms',
          },
        },
      },
    },
  },
});
// #endregion Styled

// #region NextJS Data Fetching Functions
export async function getStaticPaths(): Promise<
  GetStaticPathsResult<{ slug: string }>
> {
  const paths = allPosts.map((article) => ({
    params: {
      slug: article.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{ post: Post; readingTime: string }>
> {
  const currentPost = allPosts.find(
    (record) => record.slug === params?.slug,
  ) as Post;

  const post = {
    ...currentPost,
    date: format(new Date(currentPost.date), 'dd LLLL yyyy'),
  };

  const readingTime = readTime(post.body.raw, {
    wordsPerMinute: 255,
  }).text;

  return {
    props: {
      post,
      readingTime,
    },
  };
}
// #endregion NextJS Data Fetching Functions

export default function BlogPost({
  post,
  readingTime,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const articleRef = useRef<HTMLDivElement>(null);

  const MDXContent = useMDXComponent(post.body.code);

  return (
    <>
      <SEO
        title={post.title}
        canonical={post.slug}
        description={post.description}
        image={post.thumbnail}
        keywords={post.category}
      />
      <StyledWrapper>
        <h1 className="title">{post.title}</h1>
        <h2 className="excerpt">{post.excerpt}</h2>
        <div className="date-wrapper">
          <p>Published at : {post.date}</p>
          <p className="reading-time">{readingTime}</p>
        </div>
        <div className="article-wrapper prose" ref={articleRef}>
          <MDXContent components={MDXComponent} />
        </div>
        <div className="sharer-wrapper">
          <ul className="sharer-lists">
            <li className="sharer-item">
              <a
                className="sharer-link"
                href={`https://www.facebook.com/sharer/sharer.php?u=${profile.baseURL}/blog/${post.slug}`}
              >
                Share to Facebook
              </a>
            </li>
            <li className="sharer-item">
              <a
                className="sharer-link"
                href={`https://twitter.com/intent/tweet?url=${profile.baseURL}/blog/${post.slug}&text=${post.title}`}
              >
                Share to Twitter
              </a>
            </li>
          </ul>
        </div>
      </StyledWrapper>
    </>
  );
}
