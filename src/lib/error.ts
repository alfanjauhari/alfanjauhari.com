import type { APIError, Status } from "better-auth";

export interface MiddlewareError {
  __middlewareError: true;
  status: Status;
  code: string;
  message: string;
}

export function buildMiddlewareError(
  data: Omit<MiddlewareError, "__middlewareError">,
): MiddlewareError {
  return {
    ...data,
    __middlewareError: true,
  };
}

export function hasMiddlewareError<T>(
  context: T,
): context is T & { error: MiddlewareError } {
  return (
    context &&
    typeof context === "object" &&
    "error" in context &&
    !!context.error &&
    typeof context.error === "object" &&
    "__middlewareError" in context.error
  );
}

export function isMiddlewareError(error: unknown): error is MiddlewareError {
  return !!error && typeof error === "object" && "__middlewareError" in error;
}

export const COMMON_CODE_ERRORS = {
  404: "For some reason the requested record not found in the database. Must be the wind",
  429: "Well, too much clicking. Nice try!",
  403: "Forbidden. Not so fast!",
};

export function handleCommonApiError(
  error: APIError,
  overrides?: Partial<Record<keyof typeof COMMON_CODE_ERRORS, string>>,
) {
  switch (error.status) {
    case 404:
    case 429:
    case 403:
      return overrides?.[error.status] || COMMON_CODE_ERRORS[error.status];
    default:
      return "Unknown error. Probably the wind";
  }
}
