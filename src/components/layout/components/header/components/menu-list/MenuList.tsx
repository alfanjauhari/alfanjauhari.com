import { styled } from '@/theme';
import { ComponentProps } from 'react';

// #region Styled
export const MenuList = styled('ul', {
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
// #endregion Styled

export type MenuListProps = ComponentProps<typeof MenuList>;
