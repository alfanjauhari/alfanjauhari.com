import { HTMLAttributes } from 'react';
import { StyledHr } from './hr.styles';

export type HrProps = HTMLAttributes<HTMLHRElement>;

export function Hr(props: HrProps) {
  return <StyledHr {...props} />;
}
