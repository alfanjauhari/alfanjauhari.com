import { formOptions } from "@tanstack/react-form";
import { createServerFn } from "@tanstack/react-start";
import { APIError } from "better-auth";
import z, { ZodError } from "zod";
import { auth } from "@/lib/auth.server";

const RegisterSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
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
