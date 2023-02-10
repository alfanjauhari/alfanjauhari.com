import { OlHTMLAttributes } from 'react';
import { StyledOl } from './ol.styles';

export type OlProps = OlHTMLAttributes<HTMLOListElement>;

export function Ol({ start, ...props }: OlProps) {
  return (
    <StyledOl
      css={{
        counterSet: `custom-counter ${start ? start - 1 : 0}`,
      }}
      {...props}
    />
  );
}
