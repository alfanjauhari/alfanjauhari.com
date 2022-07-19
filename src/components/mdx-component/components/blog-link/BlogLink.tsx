import Link from 'next/link';
import { AnchorHTMLAttributes, PropsWithChildren } from 'react';

export type BlogLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
export function BlogLink({
  href,
  children,
  ...props
}: PropsWithChildren<BlogLinkProps>) {
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
    <a
      target="_blank"
      href={href}
      className="text-blue-600 hover:text-blue-500 duration-300"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}
