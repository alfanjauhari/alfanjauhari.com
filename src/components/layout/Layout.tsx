import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren } from 'react';
import { Header } from './components';

export function Layout({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  const classNames = clsx(
    'w-full overflow-hidden px-4 md:px-16 lg:px-32 xl:px-40 2xl:px-72',
    className,
  );

  return (
    <>
      <Header />
      <main className={classNames} {...props}>
        {children}
      </main>
    </>
  );
}
