import { Layout } from '@/components';
import { globalCSS } from '@/theme';
import { AppProps } from 'next/app';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppProps) {
  globalCSS();

  return (
    <Layout>
      <Head>
        <link rel="icon" href="/images/icon.webp" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
