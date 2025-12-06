import { Link, useLocation } from "@tanstack/react-router";
import { Laptop2Icon, MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, type HTMLAttributes } from "react";
import { NAVIGATIONS } from "@/constants";
import { useThemeContext } from "@/context/theme-context";
import { useToggle } from "@/hooks/use-toggle";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";
import { Button } from "./ui/button";

function ThemeToggleButton() {
  const { setTheme, theme } = useThemeContext();

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
            className="font-serif text-2xl font-bold tracking-tighter hover:opacity-70 transition-opacity text-foreground relative z-50"
            title="Alfan Jauhari"
          >
            AJ.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase text-foreground">
            <ul className="flex items-center gap-6 lg:gap-8">
              {NAVIGATIONS.map((nav) => (
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center md:hidden"
            >
              <ul className="flex flex-col items-center gap-8">
                {NAVIGATIONS.map((nav, i) => (
                  <motion.li
                    key={nav.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1 * i,
                    }}
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
                  </motion.li>
                ))}
              </ul>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-12 text-xs font-mono uppercase tracking-widest text-foreground"
              >
                © {new Date().getFullYear()} Alfan Jauhari
              </motion.p>
            </motion.nav>
          )}
        </AnimatePresence>
      </>
    );
  },
);
