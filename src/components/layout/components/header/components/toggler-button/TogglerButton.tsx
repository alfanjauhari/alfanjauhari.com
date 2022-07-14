import clsx from 'clsx';
import { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components';

export type TogglerButtonProps = ButtonProps & {
  isMenuOpen: boolean;
};

export const TogglerButton = forwardRef<HTMLButtonElement, TogglerButtonProps>(
  ({ isMenuOpen, ...props }, ref) => {
    return (
      <Button
        variant="secondary"
        size="sm"
        className={clsx(
          isMenuOpen ? 'md:hidden z-50 fixed right-4' : 'md:hidden',
        )}
        ref={ref}
        {...props}
      >
        <span className="font-semibold">{isMenuOpen ? 'Close' : 'Menu'}</span>
      </Button>
    );
  },
);
