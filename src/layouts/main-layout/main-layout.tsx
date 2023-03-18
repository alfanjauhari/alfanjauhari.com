import { menu, profile } from '@/configs';
import { useToggle } from '@/hooks';
import Image from 'next/image';
import { ComponentProps, forwardRef } from 'react';
import {
  StyledAvatarHeading,
  StyledAvatarLink,
  StyledAvatarWrapper,
  StyledHeader,
  StyledMainLayout,
  StyledMenuList,
  StyledMenuListItem,
  StyledMenuListItemLink,
  StyledTogglerButton,
  StyledTogglerButtonText,
} from './main-layout.styles';

export type MainLayoutProps = ComponentProps<typeof StyledMainLayout>;

export const MainLayout = forwardRef<HTMLElement, MainLayoutProps>(
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
                <StyledMenuListItemLink onClick={toggleMenu} href={path}>
                  {name}
                </StyledMenuListItemLink>
              </StyledMenuListItem>
            ))}
          </StyledMenuList>
        </StyledHeader>
        <StyledMainLayout id="main-content" ref={ref} {...props}>
          {children}
        </StyledMainLayout>
      </>
    );
  },
);
