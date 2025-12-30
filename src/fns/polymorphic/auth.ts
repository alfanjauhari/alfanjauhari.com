import { formOptions } from "@tanstack/react-form";
import { createServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth";
import z, { ZodError } from "zod";
import { auth } from "@/lib/auth.server";

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
  .handler(async ({ data }) => {
    try {
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
          message: error.message,
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
