import { cn } from "@/lib/utils";
import { cva } from "@/utils/cva";
import type { VariantProps } from "cva";
import { type ComponentProps } from "solid-js";

const alertVariants = cva({
	base: "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[--spacing(4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
	variants: {
		variant: {
			default: "bg-card text-card-foreground",
			destructive:
				"text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function Alert({ variant, ...props }: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return (
		<div
			{...props}
			data-slot="alert"
			role="alert"
			class={cn(alertVariants({ variant: variant }), props.class)}
		/>
	);
}

function AlertTitle(props: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-slot="alert-title"
			class={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", props.class)}
		/>
	);
}

function AlertDescription(props: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-slot="alert-description"
			class={cn(
				"text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
				props.class
			)}
		/>
	);
}

export { Alert, AlertDescription, AlertTitle };
