import { MDXComponent, SEO } from '@/components';
import { profile } from '@/configs';
import { GetFileBySlugType } from '@/utils';
import { getMDXComponent } from 'mdx-bundler/client';
import { useEffect, useMemo, useRef, useState } from 'react';

export function BlogPost({ mdx, frontMatter }: GetFileBySlugType) {
  const [readingTime, setReadingTime] = useState<number>(0);

  const articleRef = useRef<HTMLDivElement>(null);

  const Component = useMemo(() => {
    return getMDXComponent(mdx.code);
  }, [mdx.code]);

  useEffect(() => {
    const articleText = articleRef.current?.innerText;
    const wpm = 225;
    const words = articleText?.trim().split(/\s+/).length;

    setReadingTime(Math.ceil((words || 0) / wpm));
  }, []);

  return (
    <>
      <SEO
        title={frontMatter.title}
        canonical={frontMatter.slug}
        description={frontMatter.description}
        image={frontMatter.thumbnail}
        keywords={frontMatter.category}
      />
      <div className="my-16 md:my-28">
        <div>
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl w-full leading-none">
            {frontMatter.title}
          </h1>
          <h2 className="text-gray-500 text-2xl mt-6">{frontMatter.excerpt}</h2>
          <div className="flex flex-col md:flex-row justify-between md:items-center border-t border-b border-gray-200 py-4 mt-6">
            <p>
              Published at :{' '}
              {new Date(frontMatter.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-500 mt-2 md:mt-0">
              {readingTime} minute read
            </p>
          </div>
        </div>
        <div className="mt-6 prose" ref={articleRef}>
          <Component components={MDXComponent} />
        </div>
        <div className="mt-6 border-t border-gray-300 pt-6">
          <ul className="flex">
            <li className="mr-3">
              <a
                className="text-blue-600 duration-200"
                href={`https://www.facebook.com/sharer/sharer.php?u=${profile.baseURL}/blog/${frontMatter.slug}`}
              >
                Share to Facebook
              </a>
            </li>
            <li>
              <a
                className="text-blue-600 duration-200"
                href={`https://twitter.com/intent/tweet?url=${profile.baseURL}/blog/${frontMatter.slug}&text=${frontMatter.title}`}
              >
                Share to Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
