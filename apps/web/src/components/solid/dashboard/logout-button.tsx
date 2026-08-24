import { authClient } from "../../../lib/auth-client";
import { LogOutIcon } from "lucide-solid";
import { createSignal } from "solid-js";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export function LogoutButton() {
	const [pending, setPending] = createSignal(false);

	const onSignOut = async () => {
		setPending(true);

		try {
			await authClient.signOut();
			window.location.href = "/auth/login";
		} catch {
			setPending(false);
		}
	};

	return (
		<Button
			variant="outline"
			class="border-destructive hover:bg-red-600 hover:text-destructive-foreground"
			onClick={onSignOut}
			disabled={pending()}
		>
			{pending() ? <Spinner class="size-4" /> : <LogOutIcon class="size-4" />}
			<span>Log Out</span>
		</Button>
	);
}
