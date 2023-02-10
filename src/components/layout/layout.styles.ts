import { styled } from '@/theme';
import Link from 'next/link';
import { StyledButton } from '../button';

export const StyledLayout = styled('main', {
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

export const StyledHeader = styled('header', {
  position: 'sticky',
  top: 0,
  width: '100%',
  px: '$4',
  py: '$4',
  backgroundColor: 'rgb(255 255 255/0.7)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: '10',
  backdropFilter: 'blur(12px)',
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

export const StyledAvatarWrapper = styled('div', {
  width: '48px',
  height: '48px',
  position: 'relative',
});

export const StyledAvatarLink = styled(Link, {
  display: 'flex',
  alignItems: 'center',
});

export const StyledAvatarHeading = styled('h1', {
  fontWeight: '600',
  ml: '$2',
});

export const StyledTogglerButton = styled(StyledButton, {
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

export const StyledTogglerButtonText = styled('p', {
  fontWeight: '700',
});

export const StyledMenuList = styled('ul', {
  variants: {
    isMenuOpen: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        width: '100%',
        height: '100vh',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'White',
        zIndex: 10,
        '@md': {
          position: 'sticky',
          width: 'auto',
          height: 'auto',
          inset: 'auto',
          justifyContent: 'start',
          backgroundColor: 'transparent',
          flexDirection: 'row',
        },
      },
      false: {
        display: 'none',
        '@md': {
          display: 'flex',
          alignItems: 'center',
        },
      },
    },
  },
});

export const StyledMenuListItem = styled('li', {
  '&:first': {
    mr: 0,
    mt: 0,
    '@md': {
      mr: '$4',
    },
  },
  mt: '$6',
  mr: 0,
  '@md': {
    mr: '$4',
    mt: 0,
  },
});

export const StyledMenuListItemLink = styled(Link, {
  fontWeight: '600',
});
