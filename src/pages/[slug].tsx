import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next';

import { MDXComponent, SEO } from '@/components';
import { styled } from '@/theme';
import { allPages, Page as TPage } from '@contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';

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

// #region NextJS Data Fetching Function
export async function getStaticPaths() {
  const pages = allPages;
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
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{ page: TPage }>
> {
  const page = allPages.find((record) => record.slug === params?.slug) as TPage;

  return {
    props: {
      page,
    },
  };
}
// #endregion NextJS Data Fetching Function

export default function Page({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(page.body.code);

  return (
    <>
      <SEO
        canonical={page.slug}
        description={page.description}
        title={page.title}
      />
      <StyledWrapper>
        <div className="title-wrapper">
          <h1 className="page-title">{page.title}</h1>
        </div>
        <div className="content-wrapper prose">
          <MDXContent components={MDXComponent} />
        </div>
      </StyledWrapper>
    </>
  );
}
