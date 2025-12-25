import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { type FormEvent, useState } from "react";
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
import { handleLoginForm, loginFormOpts } from "@/fns/polymorphic/login";

export const Route = createFileRoute("/(app)/auth/_auth/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [loginError, setLoginError] = useState("");
  const navigate = Route.useNavigate();

  const loginMutation = useServerFn(handleLoginForm);

  const form = useForm({
    ...loginFormOpts,
    onSubmit: async ({ value }) => {
      const data = await loginMutation({
        data: value,
      });

      switch (data.code) {
        case "SUCCESS":
          navigate({
            to: "/",
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
      <h1 className="font-serif text-4xl font-bold text-center mb-4">
        Welcome Back!
      </h1>
      <p className="text-center text-sm mb-8 font-mono uppercase tracking-widest text-foreground/50">
        Login to access your account
      </p>

      {loginError && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

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
    </div>
  );
}
