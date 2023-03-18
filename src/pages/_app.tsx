import { globalCSS } from '@/theme';
import { JetBrains_Mono as JetBrainsMono, Poppins } from '@next/font/google';
import { AppProps } from 'next/app';
import Head from 'next/head';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const jetBrainsMono = JetBrainsMono({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  globalCSS({
    html: {
      '--font-sans': poppins.style.fontFamily,
      '--font-mono': jetBrainsMono.style.fontFamily,
    },
  })();

  return (
    <>
      <Head>
        <link rel="icon" href="/images/icon.webp" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
