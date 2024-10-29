"use client";

import { NAVIGATION_MENU } from "@/libs/config";
import { cn } from "@/libs/utils";
import { type ComponentProps, forwardRef } from "react";

export interface HeaderProps extends ComponentProps<"header"> {
  pathname: string;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, pathname, ...props }, ref) => {
    return (
      <header
        className={cn(
          "top-0 z-50 w-full px-6 h-20 flex justify-between items-center bg-transparent mx-auto duration-200",
          className
        )}
        ref={ref}
        {...props}
      >
        <a
          href="/"
          className="flex items-center gap-3 z-20 relative font-heading text-4xl text-stone-700"
        >
          A.
        </a>
        <nav>
          <ul className="flex items-center justify-center gap-4">
            {NAVIGATION_MENU.map((menu) => (
              <li key={menu.href}>
                <a
                  href={menu.href}
                  aria-current={pathname === menu.href ? "page" : undefined}
                  className="text-sm aria-[current=page]:underline aria-[current=page]:decoration-dotted text-stone-700"
                >
                  {menu.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  }
);

Header.displayName = "Layout__Header";
