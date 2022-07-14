import { menu, profile } from '@/configs';
import { useToggle } from '@/hooks';
import Link from 'next/link';
import { forwardRef, HTMLAttributes } from 'react';
import { Avatar, MenuList, TogglerButton } from './components';

export type HeaderProps = HTMLAttributes<HTMLElement>;

export const Header = forwardRef<HTMLElement, HeaderProps>((props, ref) => {
  const [isMenuOpen, toggleMenu] = useToggle();

  return (
    <header
      className="sticky top-0 w-full px-4 md:px-16 lg:px-32 xl:px-40 2xl:px-72 py-4 bg-white bg-opacity-90 flex justify-between items-center z-10 backdrop-filter backdrop-blur-md"
      ref={ref}
      {...props}
    >
      <div>
        <Link href="/" passHref>
          <a className="flex items-center">
            <Avatar
              src="/images/profile-image.webp"
              alt={profile.name}
              size="lg"
            />
            <h1 className="font-semibold ml-2">{profile.name}</h1>
          </a>
        </Link>
      </div>
      <TogglerButton isMenuOpen={isMenuOpen} onClick={toggleMenu} />
      <MenuList isMenuOpen={isMenuOpen}>
        {menu.map(({ path, name }) => (
          <li
            className="first:mr-0 first:mt-0 first:md:mr-4 mt-6 mr-0 md:mr-4 md:mt-0"
            key={path}
          >
            <Link href={path}>
              <a className="font-semibold">{name}</a>
            </Link>
          </li>
        ))}
      </MenuList>
    </header>
  );
});
