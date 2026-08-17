import { cn } from "@/lib/utils";
import { type ComponentProps } from "solid-js";

function Label(props: ComponentProps<"label">) {
	return (
		<label
			{...props}
			data-slot="label"
			class={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				props.class
			)}
		/>
	);
}

export { Label };
