import tailwindTypography from "@tailwindcss/typography";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi-Variable", ...defaultTheme.fontFamily.sans],
        heading: ["Anton"],
      },
      fontSize: {
        "10xl": ["10rem", 1],
      },
      typography: ({ theme }) => ({
        stone: {
          css: {
            "--tw-prose-body": theme("colors.stone[800]"),
            "--tw-prose-headings": theme("colors.stone[900]"),
            "--tw-prose-lead": theme("colors.stone[700]"),
            "--tw-prose-links": theme("colors.stone[900]"),
            "--tw-prose-bold": theme("colors.stone[900]"),
            "--tw-prose-counters": theme("colors.stone[700]"),
            "--tw-prose-bullets": theme("colors.stone[400]"),
            "--tw-prose-hr": theme("colors.stone[300]"),
            "--tw-prose-quotes": theme("colors.stone[900]"),
            "--tw-prose-quote-borders": theme("colors.stone[300]"),
            "--tw-prose-captions": theme("colors.stone[700]"),
            "--tw-prose-code": theme("colors.stone[900]"),
            "--tw-prose-pre-code": theme("colors.stone[100]"),
            "--tw-prose-pre-bg": theme("colors.stone[900]"),
            "--tw-prose-th-borders": theme("colors.stone[300]"),
            "--tw-prose-td-borders": theme("colors.stone[200]"),
            "--tw-prose-invert-body": theme("colors.stone[200]"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-lead": theme("colors.stone[300]"),
            "--tw-prose-invert-links": theme("colors.white"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-counters": theme("colors.stone[400]"),
            "--tw-prose-invert-bullets": theme("colors.stone[700]"),
            "--tw-prose-invert-hr": theme("colors.stone[700]"),
            "--tw-prose-invert-quotes": theme("colors.stone[100]"),
            "--tw-prose-invert-quote-borders": theme("colors.stone[700]"),
            "--tw-prose-invert-captions": theme("colors.stone[400]"),
            "--tw-prose-invert-code": theme("colors.white"),
            "--tw-prose-invert-pre-code": theme("colors.stone[300]"),
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": theme("colors.stone[700]"),
            "--tw-prose-invert-td-borders": theme("colors.stone[700]"),
          },
        },
      }),
    },
  },
  plugins: [tailwindTypography()],
};
