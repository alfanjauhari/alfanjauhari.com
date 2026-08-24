import { cn } from "../../../lib/utils";
import { type ComponentProps } from "solid-js";

function Separator(
	props: ComponentProps<"div"> & {
		orientation?: "horizontal" | "vertical";
		decorative?: boolean;
	}
) {
	return (
		<div
			{...props}
			role={props.decorative === false ? "separator" : "none"}
			data-slot="separator"
			data-orientation={props.orientation ?? "horizontal"}
			class={cn(
				"bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
				props.class
			)}
		/>
	);
}

export { Separator };
