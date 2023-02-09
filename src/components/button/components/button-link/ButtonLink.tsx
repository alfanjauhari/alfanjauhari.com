import { styled } from '@/theme';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { Button } from '../../Button';

// #region Styled
export const ButtonLink = styled(Link, Button, {
  '&:hover': {
    color: 'White',
  },
});
// #endregion Styled

export type ButtonLinkProps = ComponentProps<typeof ButtonLink>;
