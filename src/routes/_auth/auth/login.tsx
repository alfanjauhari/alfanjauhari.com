import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useCallback, useState } from "react";
import z from "zod";
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
import { handleLoginForm, loginFormOpts } from "@/fns/polymorphic/auth";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/_auth/auth/login")({
  component: LoginPage,
  head: () =>
    seoHead({
      title: "Login",
      description:
        "Log in to your account to access personalized features and continue your experience seamlessly.",
      canonical: "/auth/login",
      image: `${clientEnv.VITE_CLOUDINARY_URL}/og/auth/login.webp`,
    }),
  validateSearch: z.object({
    redirectTo: z
      .string()
      .default("/")
      .transform((url) => {
        if (url.includes("http")) {
          return "/";
        }

        return url;
      }),
  }),
});

function LoginPage() {
  const [loginError, setLoginError] = useState("");

  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();

  const redirectTo = searchParams.redirectTo;

  const loginMutation = useServerFn(handleLoginForm);

  const form = useForm({
    ...loginFormOpts,
    listeners: {
      onChange: useCallback(() => {
        setLoginError("");
      }, []),
    },
    onSubmit: async ({ value }) => {
      const data = await loginMutation({
        data: value,
      });

      switch (data.code) {
        case "SUCCESS":
          navigate({
            to: redirectTo,
          });

          break;
        case "AUTH_ERROR":
          setLoginError(data.message);

          form.setErrorMap({
            onChange: {
              fields: {
                email: true,
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
          setLoginError(data.message);
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
      <div className="login-header">
        <h1 className="font-serif text-4xl font-bold text-center mb-4">
          Welcome Back!
        </h1>
        <p className="text-center text-sm mb-8 font-mono uppercase tracking-widest text-foreground/50">
          Login to access your account
        </p>
      </div>

      {loginError && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <SocialLogins redirectTo={redirectTo} />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 text-foreground/50 font-mono">
            Or login with email
          </span>
        </div>
      </div>

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
                <>
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm underline -mt-3"
                  >
                    Forgot your password?
                  </Link>
                </>
              );
            }}
          </form.Field>

          <form.Subscribe selector={(formState) => formState.isSubmitting}>
            {(isSubmitting) => (
              <Button className="h-10">
                {isSubmitting && <Spinner />}
                Login
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      <p className="text-foreground/50 text-sm text-center">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-foreground underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
