import { profile } from '@/configs';
import Head from 'next/head';

export type SEOProps = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  image?: string;
};

export function SEO({
  title,
  description,
  keywords = '',
  canonical,
  image,
}: SEOProps) {
  return (
    <Head>
      <title>{`${title} - ${profile.name}`}</title>

      <link rel="canonical" href={profile.baseURL + canonical} />

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta content={profile.baseURL + canonical} property="og:url" />
      <meta content={`${title} - ${profile.name}`} property="og:title" />
      <meta content={description} property="og:description" />
      <meta
        content={`${profile.baseURL}/api/og?title=${title}`}
        property="og:image"
      />
      <meta
        content={image ? 'summary_large_image' : 'summary'}
        name="twitter:card"
      />
      <meta content={profile.twitter} name="twitter:creator" />
      <meta content={profile.twitter} name="twitter:site" />
      <meta content={`${title} - ${profile.name}`} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta
        content={`${profile.baseURL}/api/og?title=${title}`}
        name="twitter:image"
      />
      <meta content={`${title} - ${profile.name}`} name="twitter:alt" />
    </Head>
  );
}
