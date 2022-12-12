import { ComponentType, ElementType, forwardRef } from 'react';
import { clsx } from 'clsx';
import { RecipeVariants } from 'node_modules/@vanilla-extract/recipes';
import { RuntimeFn } from 'node_modules/@vanilla-extract/recipes/dist/declarations/src/types.js';

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
		return <Component {...rest} ref={ref} className={clsx(c, className)} />;
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
