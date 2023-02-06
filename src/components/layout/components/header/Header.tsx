import { menu, profile } from '@/configs';
import { useToggle } from '@/hooks';
import { styled } from '@/theme';
import Link from 'next/link';
import { forwardRef, HTMLAttributes } from 'react';
import { Avatar, MenuList, TogglerButton } from './components';

export type HeaderProps = HTMLAttributes<HTMLElement>;

// #region Styled
const StyledHeader = styled('header', {
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

const StyledAvatarLink = styled(Link, {
  display: 'flex',
  alignItems: 'center',
});

const StyledAvatarHeading = styled('h1', {
  all: 'unset',
  fontWeight: '600',
  ml: '$2',
});

const StyledMenuListItem = styled('li', {
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

const StyledMenuListItemLink = styled(Link, {
  fontWeight: '600',
});
// #endregion Styled

export const Header = forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const [isMenuOpen, toggleMenu] = useToggle();

  return (
    <StyledHeader ref={ref} {...props}>
      <StyledAvatarLink href="/">
        <Avatar src="/images/profile-image.webp" alt={profile.name} />
        <StyledAvatarHeading>{profile.name}</StyledAvatarHeading>
      </StyledAvatarLink>
      <TogglerButton isMenuOpen={isMenuOpen} onClick={toggleMenu} />
      <MenuList isMenuOpen={isMenuOpen}>
        {menu.map(({ path, name }) => (
          <StyledMenuListItem key={path}>
            <StyledMenuListItemLink href={path}>{name}</StyledMenuListItemLink>
          </StyledMenuListItem>
        ))}
      </MenuList>
    </StyledHeader>
  );
});
