import { ComponentProps, forwardRef } from 'react';
import { StyledButton } from './button.styles';

export type ButtonProps = ComponentProps<typeof StyledButton>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <StyledButton ref={ref} {...props} />;
  },
);
