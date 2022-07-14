import { getFileBySlug, getPages } from '@/utils';
import { Page } from '@/views';
import { GetStaticPropsContext } from 'next';

export default Page;

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
