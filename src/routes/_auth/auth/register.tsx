import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useCallback, useState } from "react";
import { SocialLogins } from "@/components/social-logins";
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
import { handleRegisterForm, registerFormOpts } from "@/fns/polymorphic/auth";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/_auth/auth/register")({
  component: RouteComponent,
  head: () =>
    seoHead({
      title: "Register",
      description:
        "Create an account to unlock personalized features and enjoy a better experience on my platform.",
      canonical: "/auth/register",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/auth/register.webp`,
    }),
});

function RouteComponent() {
  const [registerError, setRegisterError] = useState("");

  const navigate = Route.useNavigate();

  const registerMutation = useServerFn(handleRegisterForm);

  const form = useForm({
    ...registerFormOpts,
    listeners: {
      onChange: useCallback(() => {
        setRegisterError("");
      }, []),
    },
    onSubmit: async ({ value }) => {
      const data = await registerMutation({
        data: value,
      });

      switch (data.code) {
        case "SUCCESS":
          navigate({
            to: "/",
          });
          break;
        case "AUTH_ERROR": {
          setRegisterError(data.message);

          const emailSpecificErrors = ["USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"];
          const passwordSpecificErrors = ["PASSWORD_TOO_SHORT"];

          form.setErrorMap({
            onChange: {
              fields: {
                email: emailSpecificErrors.includes(data.errorCode)
                  ? true
                  : undefined,
                password: passwordSpecificErrors.includes(data.errorCode)
                  ? true
                  : undefined,
                confirmPassword: passwordSpecificErrors.includes(data.errorCode)
                  ? true
                  : undefined,
              },
            },
          });

          break;
        }

        case "VALIDATION_ERROR":
          form.setErrorMap({
            onSubmit: {
              fields: data.errors.fieldErrors,
            },
          });

          break;
        default:
          setRegisterError(data.message);
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
        Hello World!
      </h1>
      <p className="text-center text-sm mb-8 font-mono uppercase tracking-widest text-foreground/50">
        Create an account to enjoy a better experience
      </p>

      {registerError && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Register Failed</AlertTitle>
          <AlertDescription>{registerError}</AlertDescription>
        </Alert>
      )}

      <SocialLogins />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-foreground/50 font-mono">
            Or register with email
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mb-12">
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
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
                    type="email"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
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
                    type="password"
                    aria-invalid={isInvalid}
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
                  <FieldLabel htmlFor={field.name}>
                    Password Confirmation
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    aria-invalid={isInvalid}
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
                Register
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <p className="text-foreground/50 text-sm text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-foreground underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
