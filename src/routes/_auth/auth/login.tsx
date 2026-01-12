import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import { loginFormOpts } from "@/fns/polymorphic/auth";
import { authClient } from "@/lib/auth";
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
      .default("/dashboard")
      .transform((url) => {
        if (url.includes("http")) {
          return "/";
        }

        return url;
      }),
    error: z.string().optional(),
  }),
});

function LoginPage() {
  const [loginError, setLoginError] = useState("");

  const searchParams = Route.useSearch();

  const redirectTo = searchParams.redirectTo;
  const error = searchParams.error;

  // #region BEHOLD USEEFFECTS!
  useEffect(() => {
    if (!error) return;

    switch (error) {
      case "INVALID_TOKEN":
        setLoginError("Invalid login token. Please try again");
        break;
      default:
        setLoginError(error);
    }
  }, [error]);
  // #endregion

  const loginMutation = useMutation({
    mutationFn: (email: string) =>
      authClient.signIn.magicLink({
        email,
        callbackURL: redirectTo,
        errorCallbackURL: "/auth/login",
        newUserCallbackURL: "/dashboard",
      }),
  });

  const form = useForm({
    ...loginFormOpts,
    listeners: {
      onChange: useCallback(() => {
        setLoginError("");
      }, []),
    },
    onSubmit: async ({ value }) => {
      const data = await loginMutation.mutateAsync(value.email);

      if (data.error) {
        setLoginError(data.error.message || "");

        form.setErrorMap({
          onChange: {
            fields: {
              email: true,
            },
          },
        });
      } else {
        toast.success("Magic link sent. Please check your email!");
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

      <form onSubmit={onSubmit}>
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
          <form.Subscribe selector={(formState) => formState.isSubmitting}>
            {(isSubmitting) => (
              <Button className="h-10">
                {isSubmitting && <Spinner />}
                Send Magic Link
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
