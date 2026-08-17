import { cn } from "@/lib/utils";
import { type ComponentProps } from "solid-js";

function Input(props: ComponentProps<"input">) {
	return (
		<input
			{...props}
			data-slot="input"
			class={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-input/30 border-input h-10 w-full min-w-0 border px-3 py-1 text-base transition-[color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				props.class
			)}
		/>
	);
}

export { Input };
