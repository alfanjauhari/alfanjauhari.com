import { getArticles, getFileBySlug } from '@/utils';
import { BlogPost } from '@/views';
import { GetStaticPropsContext } from 'next';

export default BlogPost;

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
