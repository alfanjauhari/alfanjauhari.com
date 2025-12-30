import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useCallback, useState } from "react";
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
  forgotPasswordFormOpts,
  handleForgotPasswordForm,
} from "@/fns/polymorphic/auth";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/_auth/auth/forgot-password")({
  component: RouteComponent,
  head: () =>
    seoHead({
      title: "Forgot Password",
      description:
        "Forgot your password? Enter your email to receive password reset instructions.",
      canonical: "/auth/forgot-password",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/auth/forgot-password.webp`,
    }),
});

function RouteComponent() {
  const [forgotPasswordResult, setForgotPasswordResult] = useState<{
    error: boolean;
    message: string;
  }>();

  const forgotPasswordMutation = useServerFn(handleForgotPasswordForm);

  const form = useForm({
    ...forgotPasswordFormOpts,
    listeners: {
      onChange: useCallback(() => {
        setForgotPasswordResult(undefined);
      }, []),
    },
    onSubmit: async ({ value, formApi }) => {
      const data = await forgotPasswordMutation({
        data: value,
      });

      switch (data.code) {
        case "SUCCESS":
          setForgotPasswordResult({
            error: false,
            message:
              "If your email address is valid, you’ll receive a password reset confirmation.",
          });

          formApi.reset();

          break;
        case "AUTH_ERROR":
          setForgotPasswordResult({
            error: true,
            message: data.message,
          });

          form.setErrorMap({
            onChange: {
              fields: {
                email: true,
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
          setForgotPasswordResult({
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
        Forgot Your Password?
      </h1>
      <p className="text-center text-sm mb-8 font-mono uppercase tracking-widest text-foreground/50">
        Enter your email to receive password reset instructions.
      </p>

      {forgotPasswordResult?.error === true && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Forgot Password Failed</AlertTitle>
          <AlertDescription>{forgotPasswordResult.message}</AlertDescription>
        </Alert>
      )}
      {forgotPasswordResult?.error === false && (
        <Alert className="mb-8">
          <AlertTitle>Forgot Password Request Success</AlertTitle>
          <AlertDescription>{forgotPasswordResult.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mb-12">
        <FieldGroup>
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="email"
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
