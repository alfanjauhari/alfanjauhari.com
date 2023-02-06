import { styled } from '@/theme';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { Button } from '../../Button';

export const ButtonLink = styled(Link, Button, {
  '&:hover': {
    color: 'White',
  },
});

export type ButtonLinkProps = ComponentProps<typeof ButtonLink>;
