import type { ComponentPropsWithoutRef, JSX } from "react";
import type { ReactElementLike } from "takumi-js/helpers";

export type ElementType = keyof JSX.IntrinsicElements;

export type ElementChild =
	| ReactElementLike
	| string
	| number
	| boolean
	| null
	| undefined
	| readonly ElementChild[];

export type ElementProps<Type extends ElementType> = Omit<
	ComponentPropsWithoutRef<Type>,
	"children"
> & {
	children?: ElementChild;
	tw?: string;
};

export interface ElementNode<Type extends ElementType = ElementType> {
	props: ElementProps<Type>;
	type: Type;
}

export function element<Type extends ElementType>(
	type: Type,
	props: ElementProps<Type> = {} as ElementProps<Type>,
	...children: ElementChild[]
): ElementNode<Type> {
	const elementProps = { ...props };

	if (children.length === 1) {
		elementProps.children = children[0];
	} else if (children.length > 1) {
		elementProps.children = children;
	}

	return { props: elementProps, type };
}
