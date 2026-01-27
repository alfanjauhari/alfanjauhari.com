const defaultTypographyStyles = {
  css: {
    "div img, div figure": {
      margin: 0,
    },
    "div:has(img), div:has(figure)": {
      margin: "2rem 0",
    },
    figcaption: {
      marginTop: "0.5rem",
      fontStyle: "italic",
      fontSize: "0.85rem",
      textAlign: "center",
    },
    code: {
      userSelect: "all",
    },
    "pre code": {
      userSelect: "text",
    },
    "ol li::marker": {
      color: "var(--foreground)",
    },
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        xl: defaultTypographyStyles,
        lg: defaultTypographyStyles,
      },
    },
  },
};
