import { ButtonLink, SEO } from '@/components';
import { PostCard } from '@/components/post-card';
import { profile } from '@/configs';

export type HomeProps = {
  articles: PostType[];
};

export function Home({ articles }: HomeProps) {
  return (
    <>
      <SEO
        canonical="/"
        description="Realizing digital dreams come true as frontend developer"
        title="Home"
      />
      <section id="hero" className="my-16 md:my-28">
        <p className="text-gray-700 text-xl md:text-2xl font-mono">
          {profile.name}, {profile.job}
        </p>
        <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl 2xl:text-10xl w-full md:w-5/6 leading-none mt-3">
          {profile.tagline}
        </h1>
        <div className="flex mt-6">
          <ButtonLink variant="primary" href="/about" size="lg">
            More About Me
          </ButtonLink>
        </div>
      </section>
      <section id="articles" className="my-16 md:my-28">
        <h1 className="font-bold text-4xl lg:text-5xl leading-none">
          Latest articles
        </h1>
        <article className="flex flex-col md:flex-row flex-wrap -mx-4">
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
                  className="w-full md:w-1/2 px-4 mt-6"
                  key={frontMatter.slug}
                />
              ))}
        </article>
        {articles.length > 4 && (
          <div className="w-full mt-8">
            <ButtonLink variant="primary" size="lg" href="/blog">
              <span className="font-semibold">Load More Articles</span>
            </ButtonLink>
          </div>
        )}
      </section>
    </>
  );
}
