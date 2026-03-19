import type { SandpackTheme } from "@codesandbox/sandpack-react";

export const sandpackTheme: SandpackTheme = {
  colors: {
    surface1: "var(--colors-surface1)",
    surface2: "var(--colors-surface2)",
    surface3: "var(--colors-surface3)",
    base: "var(--colors-base)",

    clickable: "var(--colors-clickable)",
    hover: "var(--colors-hover)",
    accent: "var(--colors-accent)",

    disabled: "var(--colors-disabled)",

    error: "var(--colors-error)",
    errorSurface: "var(--colors-error-surface)",

    warning: "var(--colors-warning)",
    warningSurface: "var(--colors-warning-surface)",
  },

  syntax: {
    plain: "var(--syntax-plain)",
    comment: "var(--syntax-comment)",
    keyword: "var(--syntax-keyword)",
    definition: "var(--syntax-definition)",
    property: "var(--syntax-property)",
    static: "var(--syntax-static)",
    string: "var(--syntax-string)",
    punctuation: "var(--syntax-punctuation)",
    tag: "var(--syntax-tag)",
  },

  font: {
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
    size: "var(--font-size)",
    lineHeight: "var(--font-line-height)",
  },
};
