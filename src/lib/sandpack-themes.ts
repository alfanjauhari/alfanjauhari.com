import type { SandpackTheme } from "@codesandbox/sandpack-react";
import type { Styles } from "console-feed/lib/definitions/Styles";

export const sandpackConsoleStyles: Styles = {
  BASE_BACKGROUND_COLOR: "var(--colors-surface3)",
  BASE_COLOR: "var(--colors-base)",
  BASE_FONT_FAMILY: "var(--font-mono)",
  BASE_FONT_SIZE: "var(--font-size)",
  BASE_LINE_HEIGHT: "var(--font-line-height)",
  PADDING: "8px 10px",

  LOG_COLOR: "var(--colors-base)",
  LOG_BACKGROUND: "var(--colors-surface1)",
  LOG_BORDER: "1px solid var(--colors-surface2)",

  LOG_INFO_COLOR: "var(--colors-accent)",
  LOG_INFO_BACKGROUND: "var(--colors-surface2)",
  LOG_INFO_BORDER: "1px solid var(--colors-accent)",

  LOG_COMMAND_COLOR: "var(--colors-clickable)",
  LOG_COMMAND_BACKGROUND: "var(--colors-surface2)",
  LOG_COMMAND_BORDER: "1px solid var(--colors-clickable)",

  LOG_RESULT_COLOR: "var(--syntax-string)",
  LOG_RESULT_BACKGROUND: "var(--colors-surface2)",
  LOG_RESULT_BORDER: "1px solid var(--syntax-string)",

  LOG_WARN_COLOR: "var(--colors-warning)",
  LOG_WARN_BACKGROUND: "var(--colors-warning-surface)",
  LOG_WARN_BORDER: "1px solid var(--colors-warning)",

  LOG_ERROR_COLOR: "var(--colors-error)",
  LOG_ERROR_BACKGROUND: "var(--colors-error-surface)",
  LOG_ERROR_BORDER: "1px solid var(--colors-error)",

  OBJECT_NAME_COLOR: "var(--colors-accent)",
  OBJECT_VALUE_STRING_COLOR: "var(--syntax-string)",
  OBJECT_VALUE_NUMBER_COLOR: "var(--colors-warning)",
  OBJECT_VALUE_BOOLEAN_COLOR: "var(--colors-clickable)",
  OBJECT_VALUE_NULL_COLOR: "var(--colors-disabled)",
  OBJECT_VALUE_UNDEFINED_COLOR: "var(--colors-disabled)",
  OBJECT_VALUE_REGEXP_COLOR: "var(--syntax-punctuation)",
  OBJECT_VALUE_SYMBOL_COLOR: "var(--syntax-definition)",
  OBJECT_VALUE_FUNCTION_KEYWORD_COLOR: "var(--colors-clickable)",

  HTML_TAG_COLOR: "var(--syntax-tag)",
  HTML_TAGNAME_COLOR: "var(--syntax-tag)",
  HTML_ATTRIBUTE_NAME_COLOR: "var(--syntax-punctuation)",
  HTML_ATTRIBUTE_VALUE_COLOR: "var(--syntax-string)",
  HTML_COMMENT_COLOR: "var(--syntax-comment)",
  HTML_DOCTYPE_COLOR: "var(--colors-disabled)",

  ARROW_COLOR: "var(--colors-disabled)",
  TREENODE_FONT_FAMILY: "var(--font-mono)",
  TREENODE_FONT_SIZE: "12px",
  TREENODE_LINE_HEIGHT: "var(--font-line-height)",

  TABLE_BORDER_COLOR: "var(--colors-surface2)",
  TABLE_TH_BACKGROUND_COLOR: "var(--colors-surface1)",
  TABLE_TH_HOVER_COLOR: "var(--colors-surface2)",
  TABLE_SORT_ICON_COLOR: "var(--colors-accent)",
};

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
