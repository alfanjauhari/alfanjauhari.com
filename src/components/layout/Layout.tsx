import { menu, profile } from '@/configs';
import { useToggle } from '@/hooks';
import Image from 'next/image';
import { ComponentProps, forwardRef } from 'react';
import {
  StyledAvatarHeading,
  StyledAvatarLink,
  StyledAvatarWrapper,
  StyledHeader,
  StyledLayout,
  StyledMenuList,
  StyledMenuListItem,
  StyledMenuListItemLink,
  StyledTogglerButton,
  StyledTogglerButtonText,
} from './layout.styles';

export type LayoutProps = ComponentProps<typeof StyledLayout>;

export const Layout = forwardRef<HTMLElement, LayoutProps>(
  ({ children, ...props }, ref) => {
    const [isMenuOpen, toggleMenu] = useToggle();

    return (
      <>
        <StyledHeader>
          <StyledAvatarLink href="/">
            <StyledAvatarWrapper>
              <Image src="/images/profile-image.webp" alt={profile.name} fill />
            </StyledAvatarWrapper>
            <StyledAvatarHeading>{profile.name}</StyledAvatarHeading>
          </StyledAvatarLink>
          <StyledTogglerButton
            isMenuOpen={isMenuOpen}
            variant="secondary"
            size="sm"
            onClick={toggleMenu}
          >
            <StyledTogglerButtonText>
              {isMenuOpen ? 'Close' : 'Menu'}
            </StyledTogglerButtonText>
          </StyledTogglerButton>
          <StyledMenuList isMenuOpen={isMenuOpen}>
            {menu.map(({ path, name }) => (
              <StyledMenuListItem key={path}>
                <StyledMenuListItemLink href={path}>
                  {name}
                </StyledMenuListItemLink>
              </StyledMenuListItem>
            ))}
          </StyledMenuList>
        </StyledHeader>
        <StyledLayout ref={ref} {...props}>
          {children}
        </StyledLayout>
      </>
    );
  },
);
