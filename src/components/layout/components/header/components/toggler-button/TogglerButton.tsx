import { Button } from '@/components';
import { styled } from '@/theme';
import { ComponentProps, forwardRef } from 'react';

// #region Styled
const StyledTogglerButton = styled(Button, {
  variants: {
    isMenuOpen: {
      true: {
        '@md': {
          display: 'none',
        },
        zIndex: 50,
        position: 'fixed',
        right: '$4',
      },
      false: {
        '@md': {
          display: 'none',
        },
      },
    },
  },
});

const StyledTogglerButtonText = styled('p', {
  fontWeight: '700',
});
// #endregion Styled

export type TogglerButtonProps = ComponentProps<typeof StyledTogglerButton>;

export const TogglerButton = forwardRef<HTMLButtonElement, TogglerButtonProps>(
  ({ isMenuOpen, ...props }, ref) => {
    return (
      <StyledTogglerButton
        isMenuOpen={isMenuOpen}
        variant="secondary"
        size="sm"
        ref={ref}
        {...props}
      >
        <StyledTogglerButtonText>
          {isMenuOpen ? 'Close' : 'Menu'}
        </StyledTogglerButtonText>
      </StyledTogglerButton>
    );
  },
);
