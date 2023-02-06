import { styled } from '@/theme';
import { HTMLAttributes, PropsWithChildren } from 'react';
import { Header } from './components';

const StyledMain = styled('main', {
  width: '100%',
  overflow: 'hidden',
  px: '$4',
  '@md': {
    px: '64px',
  },
  '@lg': {
    px: '128px',
  },
  '@xl': {
    px: '160px',
  },
  '@xxl': {
    px: '288px',
  },
});

export function Layout({
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <>
      <Header />
      <StyledMain {...props}>{children}</StyledMain>
    </>
  );
}
