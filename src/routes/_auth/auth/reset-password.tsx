import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { type FormEvent, useCallback, useState } from "react";
import z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { clientEnv } from "@/env/client";
import {
  handleResetPasswordForm,
  resetPasswordFormOpts,
} from "@/fns/polymorphic/auth";
import { checkToken } from "@/fns/server/auth";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/_auth/auth/reset-password")({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      token: z.string(),
    }),
  ),
  loaderDeps: ({ search }) => {
    return {
      token: search.token,
    };
  },
  loader: async ({ deps }) => {
    await checkToken("reset-password", deps.token);

    return {
      token: deps.token,
    };
  },
  head: () =>
    seoHead({
      title: "Reset Password",
      description: "Enter your new password to complete the reset process.",
      canonical: "/auth/reset-password",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/auth/reset-password.webp`,
    }),
});

function RouteComponent() {
  const { token } = Route.useLoaderData();

  const [resetPasswordResult, setResetPasswordResult] = useState<{
    error: boolean;
    message: string;
  }>();

  const resetPasswordMutation = useServerFn(handleResetPasswordForm);

  const form = useForm({
    ...resetPasswordFormOpts(token),
    listeners: {
      onChange: useCallback(() => {
        setResetPasswordResult(undefined);
      }, []),
    },
    onSubmit: async ({ value, formApi }) => {
      const data = await resetPasswordMutation({
        data: value,
      });

      switch (data.code) {
        case "SUCCESS":
          setResetPasswordResult({
            error: false,
            message:
              "Your password has been successfully reset. You can now sign in with your new password.",
          });

          formApi.reset();

          break;
        case "AUTH_ERROR":
          setResetPasswordResult({
            error: true,
            message: data.message,
          });

          form.setErrorMap({
            onChange: {
              fields: {
                password: true,
              },
            },
          });

          break;

        case "VALIDATION_ERROR":
          form.setErrorMap({
            onSubmit: {
              fields: data.errors.fieldErrors,
            },
          });

          break;
        default:
          setResetPasswordResult({
            error: true,
            message: data.message,
          });
          break;
      }
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    form.handleSubmit(e.target);
  };

  return (
    <div className="w-full max-w-xl border border-border p-8 md:p-12">
      <h1 className="font-serif text-4xl font-bold text-center mb-4">
        Reset Your Password
      </h1>
      <p className="text-center text-sm mb-8 font-mono uppercase tracking-widest text-foreground/50">
        Enter your new password below to complete the reset process.
      </p>

      {resetPasswordResult?.error === true && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Reset Password Failed</AlertTitle>
          <AlertDescription>{resetPasswordResult.message}</AlertDescription>
        </Alert>
      )}
      {resetPasswordResult?.error === false && (
        <Alert className="mb-8">
          <AlertTitle>Reset Password Success</AlertTitle>
          <AlertDescription>{resetPasswordResult.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mb-12">
        <FieldGroup>
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(formState) => formState.isSubmitting}>
            {(isSubmitting) => (
              <Button className="h-10">
                {isSubmitting && <Spinner />}
                Submit
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
