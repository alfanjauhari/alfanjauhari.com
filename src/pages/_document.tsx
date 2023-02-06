import { getCssText } from '@/theme';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <style
          id="stitches"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </Head>
      <body className="min-h-screen flex flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
