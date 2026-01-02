import { Link, useLocation, useRouterState } from "@tanstack/react-router";
import { Laptop2Icon, MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { NAVIGATIONS } from "@/constants";
import { useTheme } from "@/context/theme-context";
import { useToggle } from "@/hooks/use-toggle";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

function ThemeToggleButton() {
  const [isMounted, setIsMounted] = useState(false);

  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="size-10" />;
  }

  return (
    <Button
      onClick={() => {
        setTheme(
          theme === "dark" ? "light" : theme === "light" ? "system" : "dark",
        );
      }}
      aria-label="Toggle Dark Mode"
      className="rounded-full size-10 p-0"
      variant="ghost"
      title="Toggle Theme"
    >
      {theme === "dark" ? (
        <SunIcon className="size-5" />
      ) : theme === "light" ? (
        <MoonIcon className="size-5" />
      ) : (
        <Laptop2Icon className="size-5" />
      )}
    </Button>
  );
}

export const Header = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function Header({ className, ...props }, ref) {
    const isRouteChanging = useRouterState({
      select: (state) => state.isLoading,
    });
    const [isMobileMenuOpen, toggleMobileMenu] = useToggle(false);

    const pathname = useLocation({
      select: (location) => location.pathname,
    });

    const getIsActive = (path: string) => {
      return pathname === path;
    };

    return (
      <>
        <header
          ref={ref}
          className={cn(
            "sticky top-0 z-50 flex justify-between items-center md:px-12 bg-background backdrop-blur-md transition-all duration-300 border-b border-transparent dark:border-border/50 h-24 px-6",
            className,
          )}
          {...props}
        >
          <Link
            to="/"
            className={cn(
              "font-serif text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity text-foreground relative z-50",
              {
                "motion-translate-y-loop-50 motion-ease-bounce":
                  isRouteChanging,
              },
            )}
            title="Alfan Jauhari"
          >
            AJ.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-foreground">
            <ul className="flex items-center gap-6 lg:gap-8">
              {NAVIGATIONS.filter((nav) => !nav.hideOnNav).map((nav) => (
                <li key={nav.path}>
                  <Link
                    to={nav.path}
                    className={cn(
                      "hover:line-through decoration-1 underline-offset-4",
                      {
                        "line-through": getIsActive(nav.path),
                      },
                    )}
                  >
                    {nav.label}
                  </Link>
                </li>
              ))}
              <ThemeToggleButton />
            </ul>
          </nav>
          <div className="flex items-center gap-4 md:hidden text-foreground">
            <ThemeToggleButton />
            <Button
              onClick={toggleMobileMenu}
              aria-label="Toggle Mobile Menu"
              className="rounded-full size-10 p-0"
              variant="ghost"
              title="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <XIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
        </header>
        <nav
          className={cn(
            "fixed inset-0 z-40 bg-background flex flex-col items-center justify-center md:hidden",
            {
              "motion-translate-y-in-100": isMobileMenuOpen,
              "motion-translate-y-out-100": !isMobileMenuOpen,
            },
          )}
          aria-hidden={!isMobileMenuOpen}
        >
          <ul className="flex flex-col items-center gap-8">
            {NAVIGATIONS.filter((nav) => !nav.hideOnNav).map((nav, i) => (
              <li
                key={nav.path}
                className={cn({
                  "motion-translate-y-in-100 motion-opacity-in-0":
                    isMobileMenuOpen,
                })}
                style={
                  {
                    "--motion-delay": `${0.2 * i}s`,
                  } as CSSProperties
                }
              >
                <Link
                  to={nav.path}
                  className={cn(
                    "font-serif text-4xl text-foreground hover:line-through decoration-1 underline-offset-4",
                    {
                      "line-through": getIsActive(nav.path),
                    },
                  )}
                  onClick={toggleMobileMenu}
                >
                  {nav.label}
                </Link>
              </li>
            ))}
          </ul>

          <p
            className={cn(
              "absolute bottom-12 text-xs font-mono uppercase tracking-widest text-foreground",
              {
                "motion-opacity-in-0 motion-delay-1000": isMobileMenuOpen,
              },
            )}
          >
            © {new Date().getFullYear()} Alfan Jauhari
          </p>
        </nav>
      </>
    );
  },
);
