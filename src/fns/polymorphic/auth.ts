import { formOptions } from "@tanstack/react-form";
import { mutationOptions } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { APIError } from "better-auth";
import { eq } from "drizzle-orm";
import z, { ZodError } from "zod";
import { client } from "@/db/client";
import { verificationsTable } from "@/db/schemas/verifications";
import { auth } from "@/lib/auth.server";
import { handleCommonApiError, hasMiddlewareError } from "@/lib/error";
import { authMiddleware } from "@/middleware/auth";
import { rateLimitMiddleware } from "@/middleware/rate-limit";

export const getSessionFn = createServerFn().handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  return session;
});

export const checkToken = createServerFn()
  .inputValidator(
    z.object({
      type: z.enum(["reset-password"]),
      token: z.string,
    }),
  )
  .handler(async ({ data }) => {
    const { type, token } = data;

    const tokens = await client
      .select({ id: verificationsTable.id })
      .from(verificationsTable)
      .where(eq(verificationsTable.identifier, `${type}:${token}`))
      .limit(1);

    if (!tokens.length) {
      throw notFound();
    }

    return true;
  });

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const loginFormOpts = formOptions({
  defaultValues: {
    email: "",
    password: "",
  },
  validators: {
    onChange: LoginSchema,
  },
});

export const handleLoginForm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    try {
      const validatedData = LoginSchema.parse(data);

      const response = await auth.api.signInEmail({
        body: validatedData,
      });

      return {
        code: "SUCCESS",
        response,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: z.flattenError<
            z.infer<typeof LoginSchema>,
            { message: string }
          >(error as ZodError<z.infer<typeof LoginSchema>>, (issue) => ({
            message: issue.message,
          })),
          code: "VALIDATION_ERROR",
        };
      }

      if (error instanceof APIError) {
        return {
          code: "AUTH_ERROR",
          errorCode: error.body?.code || "UNKNOWN_AUTH_ERROR",
          message: error.message,
        };
      }

      return {
        code: "UNKNOWN_ERROR",
        message: "Something went wrong",
      };
    }
  });

const RegisterSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(8, "Password length must be greater than equal 8"),
    confirmPassword: z
      .string()
      .min(8, "Password confirmation length must be greater than equal 8"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password does not match",
    path: ["confirmPassword"],
  });

export const registerFormOpts = formOptions({
  defaultValues: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  validators: {
    onChange: RegisterSchema,
  },
});

export const handleRegisterForm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    try {
      const validatedData = RegisterSchema.parse(data);

      const response = await auth.api.signUpEmail({
        body: validatedData,
      });

      return {
        code: "SUCCESS",
        response,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: z.flattenError<
            z.infer<typeof RegisterSchema>,
            { message: string }
          >(error as ZodError<z.infer<typeof RegisterSchema>>, (issue) => ({
            message: issue.message,
          })),
          code: "VALIDATION_ERROR",
        };
      }

      if (error instanceof APIError) {
        return {
          code: "AUTH_ERROR",
          errorCode: error.body?.code || "UNKNOWN_AUTH_ERROR",
          message: error.message,
        };
      }

      return {
        code: "UNKNOWN_ERROR",
        message: "Something went wrong",
      };
    }
  });

export const ForgotPasswordSchema = z.object({
  email: z.email(),
});

export const forgotPasswordFormOpts = formOptions({
  defaultValues: {
    email: "",
  },
  validators: {
    onChange: ForgotPasswordSchema,
  },
});

export const handleForgotPasswordForm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .middleware([rateLimitMiddleware("forgot-passwor", 2)])
  .handler(async ({ data, context }) => {
    try {
      if (hasMiddlewareError(context)) {
        const { error } = context;
        throw new APIError(error.status, {
          message: error.message,
          code: error.code,
        });
      }

      const validatedData = ForgotPasswordSchema.parse(data);

      const response = await auth.api.requestPasswordReset({
        body: {
          ...validatedData,
          redirectTo: "/auth/reset-password",
        },
      });

      return {
        code: "SUCCESS",
        response,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: z.flattenError<
            z.infer<typeof ForgotPasswordSchema>,
            { message: string }
          >(
            error as ZodError<z.infer<typeof ForgotPasswordSchema>>,
            (issue) => ({
              message: issue.message,
            }),
          ),
          code: "VALIDATION_ERROR",
        };
      }

      if (error instanceof APIError) {
        return {
          code: "AUTH_ERROR",
          errorCode: error.body?.code || "UNKNOWN_AUTH_ERROR",
          message: handleCommonApiError(error, {
            "429": "Too many request. Try again later",
          }),
        };
      }

      return {
        code: "UNKNOWN_ERROR",
        message: "Something went wrong. Probably the wind",
      };
    }
  });

const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password length must be greater than equal 8"),
    confirmPassword: z
      .string()
      .min(8, "Password confirmation length must be greater than equal 8"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Password does not match",
    path: ["confirmPassword"],
  });

export const resetPasswordFormOpts = (token: string) =>
  formOptions({
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: ResetPasswordSchema,
    },
  });

export const handleResetPasswordForm = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    try {
      const validatedData = ResetPasswordSchema.parse(data);

      const response = await auth.api.resetPassword({
        body: {
          newPassword: validatedData.password,
          token: validatedData.token,
        },
      });

      return {
        code: "SUCCESS",
        response,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          errors: z.flattenError<
            z.infer<typeof ResetPasswordSchema>,
            { message: string }
          >(
            error as ZodError<z.infer<typeof ResetPasswordSchema>>,
            (issue) => ({
              message: issue.message,
            }),
          ),
          code: "VALIDATION_ERROR",
        };
      }

      if (error instanceof APIError) {
        return {
          code: "AUTH_ERROR",
          errorCode: error.body?.code || "UNKNOWN_AUTH_ERROR",
          message: error.message,
        };
      }

      return {
        code: "UNKNOWN_ERROR",
        message: "Something went wrong. Probably the wind",
      };
    }
  });

export const requestEmailVerificationFn = createServerFn()
  .middleware([authMiddleware, rateLimitMiddleware("verify-email", 2)])
  .handler(async ({ context }) => {
    try {
      const { email } = context.session.user;

      if (hasMiddlewareError(context)) {
        const { error } = context;

        throw new APIError(error.status, {
          message: error.message,
          code: error.code,
        });
      }

      return auth.api.sendVerificationEmail({
        body: {
          email,
        },
      });
    } catch (error) {
      if (error instanceof APIError) {
        return {
          code: error.body?.code,
          message: handleCommonApiError(error),
        };
      }

      return {
        message: "Something went wrong. Probably the wind",
      };
    }
  });

export const requestEmailVerificationMutation = mutationOptions({
  mutationFn: () => requestEmailVerificationFn(),
});
