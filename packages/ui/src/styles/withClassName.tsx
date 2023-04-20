import { RuntimeFn } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import {
	ComponentPropsWithRef,
	ComponentType,
	ElementType,
	FunctionComponent,
	forwardRef,
} from 'react';

type VariantDef = RuntimeFn<any> & { variants: () => string[] };

type VariantProps<Base, V extends string | VariantDef> = V extends (
	...args: any[]
) => any
	? Base & Parameters<V>[0]
	: Base;

export function withClassName<
	T extends ComponentType<any> | ElementType<any>,
	V extends string | VariantDef,
>(
	Component: T,
	cs: V,
): FunctionComponent<VariantProps<ComponentPropsWithRef<T>, V>> {
	const variants: string[] =
		typeof cs === 'function' ? (cs.variants() as string[]) : [];

	const WithClassName = forwardRef<any, any>((props, ref) => {
		const { className, ...rest } = props;
		const c = typeof cs === 'function' ? cs(pick(props, variants)) : cs;
		return (
			<Component
				{...omit(rest, variants)}
				ref={ref}
				className={classNames(c, className)}
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
