import { MDXComponent, SEO } from '@/components';
import { profile } from '@/configs';
import { styled } from '@/theme';
import { getArticles, getFileBySlug, GetFileBySlugType } from '@/utils';
import { getMDXComponent } from 'mdx-bundler/client';
import { GetStaticPropsContext } from 'next';
import { useEffect, useMemo, useRef, useState } from 'react';

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

export default function BlogPost({ mdx, frontMatter }: GetFileBySlugType) {
  const [readingTime, setReadingTime] = useState<number>(0);

  const articleRef = useRef<HTMLDivElement>(null);

  const Component = useMemo(() => {
    return getMDXComponent(mdx.code);
  }, [mdx.code]);

  useEffect(() => {
    const articleText = articleRef.current?.innerText;
    const wpm = 225;
    const words = articleText?.trim().split(/\s+/).length;

    setReadingTime(Math.ceil((words || 0) / wpm));
  }, []);

  return (
    <>
      <SEO
        title={frontMatter.title}
        canonical={frontMatter.slug}
        description={frontMatter.description}
        image={frontMatter.thumbnail}
        keywords={frontMatter.category}
      />
      <StyledWrapper>
        <h1 className="title">{frontMatter.title}</h1>
        <h2 className="excerpt">{frontMatter.excerpt}</h2>
        <div className="date-wrapper">
          <p>
            Published at :{' '}
            {new Date(frontMatter.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="reading-time">{readingTime} minute read</p>
        </div>
        <div className="article-wrapper prose" ref={articleRef}>
          <Component components={MDXComponent} />
        </div>
        <div className="sharer-wrapper">
          <ul className="sharer-lists">
            <li className="sharer-item">
              <a
                className="sharer-link"
                href={`https://www.facebook.com/sharer/sharer.php?u=${profile.baseURL}/blog/${frontMatter.slug}`}
              >
                Share to Facebook
              </a>
            </li>
            <li className="sharer-item">
              <a
                className="sharer-link"
                href={`https://twitter.com/intent/tweet?url=${profile.baseURL}/blog/${frontMatter.slug}&text=${frontMatter.title}`}
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

export async function getStaticPaths() {
  const articles = await getArticles();
  const paths = articles.map((article) => ({
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
}: GetStaticPropsContext<{ slug: string }>) {
  const props = await getFileBySlug('posts', params?.slug || '');

  return {
    props,
  };
}
