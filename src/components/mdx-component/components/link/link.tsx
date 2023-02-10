import { AnchorHTMLAttributes } from 'react';
import { StyledExternalLink, StyledInternalLink } from './link.styles';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function Link({ href, children, ...props }: LinkProps) {
  const isInternalLink = href?.startsWith('/') || href?.startsWith('#');

  if (isInternalLink && href) {
    return (
      <StyledInternalLink href={href} {...props}>
        {children}
      </StyledInternalLink>
    );
  }

  return (
    <StyledExternalLink target="_blank" href={href} rel="noreferrer" {...props}>
      {children}
    </StyledExternalLink>
  );
}
