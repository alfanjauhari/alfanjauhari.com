import { ButtonLink, SEO } from '@/components';
import { PostCard } from '@/components/post-card';
import { profile } from '@/configs';
import { styled } from '@/theme';
import { getArticles } from '@/utils';

// #region Styled
const StyledHero = styled('section', {
  my: '64px',
  '@md': {
    my: '112px',
  },
  '& p.profile': {
    color: '$gray7',
    fontSize: '$xl',
    '@md': {
      fontSize: '$xxl',
      fontFamily: '$mono',
    },
  },
  '& h1.tagline': {
    fontWeight: '700',
    fontSize: '48px',
    width: '100%',
    mt: '$3',
    lineHeight: 1,
    '@md': {
      fontSize: '60px',
      width: '83.333333%',
    },
    '@lg': {
      fontSize: '72px',
    },
    '@xxl': {
      fontSize: '128px',
    },
  },
  '& div.button-wrapper': {
    display: 'flex',
    mt: '$6',
  },
});

const StyledArticles = styled('section', {
  my: '64px',
  '@md': {
    my: '112px',
  },
  '& h1.articles-title': {
    fontWeight: 'bold',
    fontSize: '36px',
    lineHeight: '$xxxl',
    '@lg': {
      fontSize: '60px',
      lineHeight: 1,
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
  '& div.load-more-wrapper': {
    mt: '$8',
    width: '100%',
  },
});
// #endregion Styled

interface HomeProps {
  articles: PostType[];
}

export default function Home({ articles }: HomeProps) {
  return (
    <>
      <SEO
        canonical="/"
        description="Realizing digital dreams come true as frontend developer"
        title="Home"
      />
      <StyledHero id="hero">
        <p className="profile">
          {profile.name}, {profile.job}
        </p>
        <h1 className="tagline">{profile.tagline}</h1>
        <div className="button-wrapper">
          <ButtonLink variant="primary" href="/about" size="lg">
            More About Me
          </ButtonLink>
        </div>
      </StyledHero>
      <StyledArticles id="articles">
        <h1 className="articles-title">Latest articles</h1>
        <article className="articles-list">
          {articles.length > 0 &&
            articles
              .slice(0, 4)
              .map((frontMatter) => (
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
        {articles.length > 4 && (
          <div className="load-more-wrapper">
            <ButtonLink variant="primary" size="lg" href="/blog">
              Load More Articles
            </ButtonLink>
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
