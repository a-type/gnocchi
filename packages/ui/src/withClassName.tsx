import { ComponentType, ElementType, forwardRef } from 'react';
import { clsx } from 'clsx';
import { RecipeVariants } from '@vanilla-extract/recipes';
import type { ComplexStyleRule } from '@vanilla-extract/css';

type RecipeStyleRule = ComplexStyleRule | string;
type VariantDefinitions = Record<string, RecipeStyleRule>;
type VariantGroups = Record<string, VariantDefinitions>;
type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;
type VariantSelection<Variants extends VariantGroups> = {
	[VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};
type RuntimeFn<Variants extends VariantGroups> = (
	options?: VariantSelection<Variants>,
) => string;

type VariantProps<V extends string | RuntimeFn<any>> = V extends RuntimeFn<any>
	? RecipeVariants<V>
	: {};

export function withClassName<
	T extends ComponentType<any> | ElementType<any>,
	V extends string | RuntimeFn<any>,
>(
	Component: T,
	cs: V,
	propFilter?: string[],
): ComponentType<React.ComponentProps<T> & VariantProps<V>> {
	const WithClassName = forwardRef<any, any>((props, ref) => {
		const { className, ...rest } = props;
		const c =
			typeof cs === 'function'
				? cs(propFilter === undefined ? props : pick(props, propFilter))
				: cs;
		return (
			<Component
				{...(propFilter === undefined ? rest : omit(rest, propFilter))}
				ref={ref}
				className={clsx(c, className)}
			/>
		);
	});
	return WithClassName as any;
}

function pick(obj: any, attrs: string[]) {
	const result: any = {};
	for (const attr of attrs) {
		result[attr] = obj[attr];
	}
	return result;
}

function omit(obj: any, attrs: string[] = []) {
	const result: any = {};
	for (const key in obj) {
		if (!attrs.includes(key)) {
			result[key] = obj[key];
		}
	}
	return result;
}