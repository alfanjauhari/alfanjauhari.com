import { styled } from '@/theme';
import { HTMLAttributes } from 'react';

export type HrProps = HTMLAttributes<HTMLHRElement>;

export const Hr = styled('hr', {
  borderTop: 0,
  borderBottom: '1px solid $colors$gray2',
  my: '$5',
});
