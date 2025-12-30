import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function LogoutButton() {
  const navigate = useNavigate();

  const signOutMutation = useMutation({
    mutationFn: () => authClient.signOut(),
  });

  const onSignOut = async () => {
    try {
      await signOutMutation.mutateAsync();

      navigate({
        to: "/auth/login",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong when trying to signing out. Probably the wind",
      );
    }
  };

  return (
    <Button
      variant="outline"
      className="border-destructive hover:bg-red-600 hover:text-destructive-foreground"
      onClick={onSignOut}
      disabled={signOutMutation.isPending}
    >
      {signOutMutation.isPending ? (
        <Spinner className="size-4" />
      ) : (
        <LogOutIcon className="size-4" />
      )}
      <span>Log Out</span>
    </Button>
  );
}
