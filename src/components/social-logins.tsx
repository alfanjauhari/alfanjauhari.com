import { useState } from "react";
import { authClient } from "@/lib/auth";
import { GithubIcon } from "./icons/github";
import { GoogleIcon } from "./icons/google";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function SocialLogins({ redirectTo }: { redirectTo: string }) {
  const [socialLogin, setSocialLogin] = useState<"github" | "google">();

  const onSocialLogin = (provider: "github" | "google") => async () => {
    setSocialLogin(provider);

    await authClient.signIn.social({
      provider,
      callbackURL: redirectTo,
    });

    setSocialLogin(undefined);
  };

  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <Button variant="secondary" size="lg" onClick={onSocialLogin("github")}>
        {socialLogin === "github" ? <Spinner /> : <GithubIcon />}
        Github
      </Button>
      <Button variant="secondary" size="lg" onClick={onSocialLogin("google")}>
        {socialLogin === "google" ? <Spinner /> : <GoogleIcon />}
        Google
      </Button>
    </div>
  );
}
