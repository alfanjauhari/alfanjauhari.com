import { cn } from "../../../lib/utils";
import { type ComponentProps } from "solid-js";

function Skeleton(props: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-slot="skeleton"
			class={cn("bg-accent animate-pulse rounded-md", props.class)}
		/>
	);
}

export { Skeleton };
