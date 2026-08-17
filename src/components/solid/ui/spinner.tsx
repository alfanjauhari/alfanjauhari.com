import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-solid";
import { type ComponentProps } from "solid-js";

function Spinner(props: ComponentProps<"svg">) {
	return (
		<LoaderCircleIcon
			{...props}
			role="status"
			aria-label="Loading"
			class={cn("size-4 animate-spin", props.class)}
		/>
	);
}

export { Spinner };
