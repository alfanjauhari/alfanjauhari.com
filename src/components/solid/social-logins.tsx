import { createSignal } from "solid-js";
import { authClient } from "@/lib/auth-client";
import { GithubIcon } from "./icons/github";
import { GoogleIcon } from "./icons/google";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function SocialLogins(props: { redirectTo?: string }) {
	const [socialLogin, setSocialLogin] = createSignal<"github" | "google" | undefined>();

	const onSocialLogin = (provider: "github" | "google") => async () => {
		setSocialLogin(provider);

		await authClient.signIn.social({
			provider,
			callbackURL: props.redirectTo,
		});

		setSocialLogin(undefined);
	};

	return (
		<div class="grid grid-cols-2 items-center gap-4">
			<Button variant="secondary" size="lg" onClick={onSocialLogin("github")}>
				{socialLogin() === "github" ? <Spinner /> : <GithubIcon />}
				Github
			</Button>
			<Button variant="secondary" size="lg" onClick={onSocialLogin("google")}>
				{socialLogin() === "google" ? <Spinner /> : <GoogleIcon />}
				Google
			</Button>
		</div>
	);
}
