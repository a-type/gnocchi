import { ComponentType, ElementType, forwardRef } from 'react';
import { clsx } from 'clsx';
import { RecipeVariants, RuntimeFn } from '@vanilla-extract/recipes';

type VariantDef = RuntimeFn<any> & { variants: () => string[] };

type VariantProps<V extends string | VariantDef> = V extends VariantDef
	? RecipeVariants<V>
	: {};

export function withClassName<
	T extends ComponentType<any> | ElementType<any>,
	V extends string | VariantDef,
>(
	Component: T,
	cs: V,
): ComponentType<React.ComponentProps<T> & VariantProps<V>> {
	const variants: string[] =
		typeof cs === 'function' ? (cs.variants() as string[]) : [];

	const WithClassName = forwardRef<any, any>((props, ref) => {
		const { className, ...rest } = props;
		const c = typeof cs === 'function' ? cs(pick(props, variants)) : cs;
		return (
			<Component
				{...omit(rest, variants)}
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
	if (attrs.length === 0) return obj;

	const result: any = {};
	for (const key in obj) {
		if (!attrs.includes(key)) {
			result[key] = obj[key];
		}
	}
	return result;
}
