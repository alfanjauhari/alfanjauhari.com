import { getFileBySlug, GetFileBySlugType, getPages } from '@/utils';
import { GetStaticPropsContext } from 'next';

import { MDXComponent, SEO } from '@/components';
import { styled } from '@/theme';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';

// #region Styled
const StyledWrapper = styled('div', {
  my: '64px',
  '@md': {
    my: '112px',
  },
  '& div.title-wrapper': {
    borderBottom: '1px',
    borderColor: '$gray2',
    borderStyle: 'solid',
    pb: '$6',
    '& h1.page-title': {
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
  },
  '& div.content-wrapper': {
    mt: '$6',
  },
});
// #endregion Styled

export default function Page({ mdx, frontMatter }: GetFileBySlugType) {
  const Component = useMemo(() => {
    return getMDXComponent(mdx.code);
  }, [mdx.code]);

  return (
    <>
      <SEO
        canonical={frontMatter.slug}
        description={frontMatter.description}
        title={frontMatter.title}
      />
      <StyledWrapper>
        <div className="title-wrapper">
          <h1 className="page-title">{frontMatter.title}</h1>
        </div>
        <div className="content-wrapper prose">
          <Component components={MDXComponent} />
        </div>
      </StyledWrapper>
    </>
  );
}

export async function getStaticPaths() {
  const pages = await getPages();
  const paths = pages.map((page) => ({
    params: {
      slug: page.slug,
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
  const props = await getFileBySlug('pages', params?.slug || '');

  return {
    props,
  };
}
