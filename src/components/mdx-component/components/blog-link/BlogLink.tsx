import { styled } from '@/theme';
import Link from 'next/link';
import { AnchorHTMLAttributes, PropsWithChildren } from 'react';

export type BlogLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

// #region Styled
const StyledInternalLink = styled(Link, {
  color: '$blue6',
  '&:hover': {
    color: '$blue8',
    transitionDuration: '300ms',
  },
});
const StyledExternalLink = styled('a', StyledInternalLink);
// #endregion Styled

export function BlogLink({
  href,
  children,
  ...props
}: PropsWithChildren<BlogLinkProps>) {
  const isInternalLink = href?.startsWith('/') || href?.startsWith('#');

  if (isInternalLink && href) {
    return <StyledInternalLink href={href} {...props} />;
  }

  return (
    <StyledExternalLink
      target="_blank"
      href={href}
      className="text-blue-600 hover:text-blue-500 duration-300"
      rel="noreferrer"
      {...props}
    >
      {children}
    </StyledExternalLink>
  );
}
