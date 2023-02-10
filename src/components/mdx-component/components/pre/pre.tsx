import { HTMLAttributes } from 'react';
import { StyledPre } from './pre.styles';

export type PreProps = HTMLAttributes<HTMLPreElement>;

export function Pre(props: PreProps) {
  return <StyledPre {...props} />;
}
