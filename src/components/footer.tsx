import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";

export const Footer = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function Footer() {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-0 h-[500px] md:h-[600px]">
        <div className="bg-[#0a0a0a] h-full flex flex-col justify-between px-6 md:px-12 pt-24 pb-6 overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start relative z-10">
            <div className="max-w-xl mb-12 md:mb-0">
              <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-none text-white">
                Have an idea? <br />
                <span className="text-gray-500 italic">Let's build it.</span>
              </h2>
              <a
                href="mailto:hi@alfanjauhari.com"
                className="group inline-flex items-center gap-3 text-sm font-mono uppercase tracking-widest border-b border-white/20 hover:border-white transition-all group text-white"
              >
                <span>hi@alfanjauhari.com</span>
                <ArrowUpRightIcon className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform size-4" />
              </a>
            </div>

            <div className="flex gap-12 md:gap-24">
              <div className="space-y-4">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Connect
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="#"
                    className="text-lg text-white/50 hover:text-white duration-300"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="text-lg text-white/50 hover:text-white duration-300"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-lg text-white/50 hover:text-white duration-300"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Explore
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/"
                    className="text-lg text-white/50 hover:text-white duration-300"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-lg text-white/50 hover:text-white duration-300"
                  >
                    About
                  </Link>
                  <Link
                    to="/writing"
                    className="text-lg text-white/50 hover:text-white duration-300"
                  >
                    Writing
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full mt-12 md:mt-0">
            <h1 className="text-[22vw] leading-[0.8] font-serif font-bold text-center tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white/10 to-transparent select-none pointer-events-none w-full">
              ALFAN
            </h1>

            <div className="absolute bottom-2 w-full flex justify-between text-xxs font-mono uppercase tracking-widest text-gray-600 px-2">
              <div className="flex gap-4">
                <span>&copy; {new Date().getFullYear()}</span>
                <span className="hidden md:inline">All Rights Reserved</span>
              </div>
              <div className="flex gap-4">
                <span>Jakarta, ID</span>
                <span>
                  Local time:{" "}
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  },
);
