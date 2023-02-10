import { HTMLAttributes } from 'react';
import { StyledUl } from './ul.styles';

export type UlProps = HTMLAttributes<HTMLUListElement>;

export function Ul(props: UlProps) {
  return <StyledUl {...props} />;
}
