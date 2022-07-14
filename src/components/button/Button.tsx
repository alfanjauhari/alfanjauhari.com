import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { baseButtonClassNames, buttonSizes, buttonVariants } from './configs';
import { CustomButtonProps } from './types';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  CustomButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      block = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        className={clsx(
          baseButtonClassNames,
          {
            [buttonSizes[size]]: !block,
            'w-full': block,
          },
          buttonVariants[variant],
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
