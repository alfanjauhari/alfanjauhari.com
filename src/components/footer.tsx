import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { forwardRef, HTMLAttributes } from "react";

export const Footer = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function Footer() {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-0 h-[500px] md:h-[600px]">
        <div className="bg-card h-full flex flex-col justify-between px-6 md:px-12 pt-24 pb-6 overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start relative z-10">
            <div className="max-w-xl mb-12 md:mb-0">
              <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-none">
                Have an idea? <br />
                <span className="text-gray-600 italic">Let's build it.</span>
              </h2>
              <a
                href="mailto:hi@alfanjauhari.com"
                className="group inline-flex items-center gap-3 text-sm font-mono uppercase tracking-widest border-b border-foreground/20 hover:border-foreground transition-all group"
              >
                <span>hi@alfanjauhari.com</span>
                <ArrowUpRightIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform size-4" />
              </a>
            </div>

            <div className="flex gap-12 md:gap-24">
              <div className="space-y-4">
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
                  Connect
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="#"
                    className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
                  Explore
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                  >
                    About
                  </Link>
                  <Link
                    to="/writing"
                    className="text-lg text-foreground/80 transition-colors hover:text-foreground"
                  >
                    Writing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  },
);
