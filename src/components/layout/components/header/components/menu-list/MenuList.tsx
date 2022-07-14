import clsx from 'clsx';
import { forwardRef, HTMLAttributes } from 'react';

export type MenuListProps = HTMLAttributes<HTMLUListElement> & {
  isMenuOpen?: boolean;
};

export const MenuList = forwardRef<HTMLUListElement, MenuListProps>(
  ({ children, isMenuOpen, ...props }, ref) => {
    const ON_MENU_OPEN_CLASSNAMES =
      'flex flex-col fixed md:static w-full md:w-auto h-screen md:h-auto inset-0 md:inset-auto items-center justify-center md:justify-start bg-white md:bg-transparent md:flex-row z-10';
    const ON_MENU_CLOSE_CLASSNAMES = 'hidden md:flex items-center';

    const classNames = clsx(
      isMenuOpen ? ON_MENU_OPEN_CLASSNAMES : ON_MENU_CLOSE_CLASSNAMES,
    );

    return (
      <ul className={classNames} ref={ref} {...props}>
        {children}
      </ul>
    );
  },
);
