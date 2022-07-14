import { Layout } from '@/components';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <link rel="icon" href="/images/icon.webp" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
