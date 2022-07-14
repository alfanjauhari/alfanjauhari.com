import {
  baseButtonClassNames,
  buttonSizes,
  buttonVariants,
} from '@/components/button';
import { CustomButtonProps } from '@/components/button/types';
import clsx from 'clsx';
import Link, { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, forwardRef } from 'react';

export type ButtonLinkProps = Overwrite<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  LinkProps
> &
  CustomButtonProps;

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      size = 'md',
      variant = 'primary',
      block = false,
      ...props
    },
    ref,
  ) => {
    return (
      <Link ref={ref} passHref {...props}>
        <a
          className={clsx(
            baseButtonClassNames,
            {
              [buttonSizes[size]]: !block,
              'w-full py-4 text-center': block,
            },
            buttonVariants[variant],
            className,
          )}
        >
          {children}
        </a>
      </Link>
    );
  },
);
