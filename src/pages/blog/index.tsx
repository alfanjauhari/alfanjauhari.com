import { getArticles } from '@/utils';
import { Blog } from '@/views';

export default Blog;

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
