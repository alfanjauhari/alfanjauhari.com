import { cn } from "../../../lib/utils";
import { cva } from "../../../utils/cva";
import type { VariantProps } from "cva";
import { splitProps, type ComponentProps, type JSX } from "solid-js";
import { Label } from "./label";
import { Separator } from "./separator";

function FieldSet(props: ComponentProps<"fieldset">) {
	return (
		<fieldset
			{...props}
			data-slot="field-set"
			class={cn(
				"flex flex-col gap-6",
				"has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
				props.class
			)}
		/>
	);
}

function FieldLegend(props: ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
	const [local, rest] = splitProps(props, ["variant", "class"]);
	return (
		<legend
			{...rest}
			data-slot="field-legend"
			data-variant={local.variant ?? "legend"}
			class={cn(
				"mb-3 font-medium",
				"data-[variant=legend]:text-base",
				"data-[variant=label]:text-sm",
				local.class
			)}
		/>
	);
}

function FieldGroup(props: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-slot="field-group"
			class={cn(
				"group/field-group @container/field-group flex w-full flex-col gap-6 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
				props.class
			)}
		/>
	);
}

const fieldVariants = cva({
	base: "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
	variants: {
		orientation: {
			vertical: ["flex-col *:w-full [&>.sr-only]:w-auto"],
			horizontal: [
				"flex-row items-center",
				"*:data-[slot=field-label]:flex-auto",
				"has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
			],
			responsive: [
				"flex-col *:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto",
				"@md/field-group:*:data-[slot=field-label]:flex-auto",
				"@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
			],
		},
	},
	defaultVariants: {
		orientation: "vertical",
	},
});

function Field(props: ComponentProps<"fieldset"> & VariantProps<typeof fieldVariants>) {
	const [local, rest] = splitProps(props, ["orientation", "class"]);
	return (
		<fieldset
			{...rest}
			data-slot="field"
			data-orientation={local.orientation ?? "vertical"}
			class={cn(fieldVariants({ orientation: local.orientation }), local.class)}
		/>
	);
}

function FieldContent(props: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-slot="field-content"
			class={cn("group/field-content flex flex-1 flex-col gap-1.5 leading-snug", props.class)}
		/>
	);
}

function FieldLabel(props: ComponentProps<typeof Label>) {
	return (
		<Label
			{...props}
			data-slot="field-label"
			class={cn(
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
				"has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-4",
				"has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
				props.class
			)}
		/>
	);
}

function FieldTitle(props: ComponentProps<"div">) {
	return (
		<div
			{...props}
			data-slot="field-label"
			class={cn(
				"flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
				props.class
			)}
		/>
	);
}

function FieldDescription(props: ComponentProps<"p">) {
	return (
		<p
			{...props}
			data-slot="field-description"
			class={cn(
				"text-muted-foreground text-sm leading-normal font-normal group-has-data-[orientation=horizontal]/field:text-balance",
				"last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
				"[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				props.class
			)}
		/>
	);
}

function FieldSeparator(props: ComponentProps<"div">) {
	const [local, rest] = splitProps(props, ["class", "children"]);
	return (
		<div
			{...rest}
			data-slot="field-separator"
			data-content={!!local.children}
			class={cn(
				"relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
				local.class
			)}
		>
			<Separator class="absolute inset-0 top-1/2" />
			{local.children && (
				<span
					class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
					data-slot="field-separator-content"
				>
					{local.children}
				</span>
			)}
		</div>
	);
}

function FieldError(props: ComponentProps<"div"> & { errors?: string[] | null }) {
	const [local, rest] = splitProps(props, ["class", "children", "errors"]);

	const content = (): JSX.Element | null => {
		if (local.children) {
			return local.children as JSX.Element;
		}

		if (!local.errors?.length) {
			return null;
		}

		const uniqueErrors = [...new Set(local.errors)];

		if (uniqueErrors.length === 1) {
			return uniqueErrors[0] as string;
		}

		return (
			<ul class="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map((error) => (
					<li>{error}</li>
				))}
			</ul>
		);
	};

	return (
		<div
			{...rest}
			role="alert"
			data-slot="field-error"
			class={cn("text-destructive text-sm font-normal", local.class)}
		>
			{content()}
		</div>
	);
}

export {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FieldTitle,
};
