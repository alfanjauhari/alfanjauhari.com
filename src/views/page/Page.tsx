import { MDXComponent, SEO } from '@/components';
import { GetFileBySlugType } from '@/utils';
import { getMDXComponent } from 'mdx-bundler/client';
import { useMemo } from 'react';

export function Page({ mdx, frontMatter }: GetFileBySlugType) {
  const Component = useMemo(() => {
    return getMDXComponent(mdx.code);
  }, [mdx.code]);

  return (
    <>
      <SEO
        canonical={frontMatter.slug}
        description={frontMatter.description}
        title={frontMatter.title}
      />
      <div className="my-16 md:my-28">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl w-full leading-none">
            {frontMatter.title}
          </h1>
        </div>
        <div className="mt-6 prose">
          <Component components={MDXComponent} />
        </div>
      </div>
    </>
  );
}
