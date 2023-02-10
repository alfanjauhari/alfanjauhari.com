import { ComponentProps, forwardRef } from 'react';
import { StyledButtonLink } from './button-link.styles';

export type ButtonLinkProps = ComponentProps<typeof StyledButtonLink>;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (props, ref) => {
    return <StyledButtonLink ref={ref} {...props} />;
  },
);
