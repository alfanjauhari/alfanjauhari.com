import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { AnchorHTMLAttributes, HTMLAttributes } from 'react';

function BlogLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternalLink = href?.startsWith('/') || href?.startsWith('#');

  if (isInternalLink && href) {
    return (
      <Link
        className="text-blue-600 hover:text-blue-500 duration-300"
        href={href}
        {...props}
      />
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      target="_blank"
      href={href}
      className="text-blue-600 hover:text-blue-500 duration-300"
      rel="noreferrer"
      {...props}
    />
  );
}

function Hr(props: HTMLAttributes<HTMLHRElement>) {
  return <hr className="border-gray-400" {...props} />;
}

function FigureImage({
  caption,
  alt,
  ...props
}: ImageProps & { caption: string }) {
  return (
    <figure>
      <div className="w-full h-[12rem] md:h-[25rem] lg:h-[32rem] relative">
        <Image layout="fill" objectFit="cover" alt={alt} {...props} />
      </div>
      <figcaption className="text-center p-4 bg-gray-50 bottom-0 w-full">
        {caption}
      </figcaption>
    </figure>
  );
}

const MDXComponent = {
  a: BlogLink,
  FigureImage,
  Hr,
};

export default MDXComponent;
