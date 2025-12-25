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
