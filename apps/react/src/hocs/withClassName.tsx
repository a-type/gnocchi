import { ComponentType, ElementType, forwardRef } from 'react';
import { clsx } from 'clsx';

export function withClassName<T extends ComponentType<any> | ElementType<any>>(
	Component: T,
	cs: string,
): T {
	const WithClassName = forwardRef<any, any>((props, ref) => {
		const { className, ...rest } = props;
		return <Component {...rest} ref={ref} className={clsx(cs, className)} />;
	});
	return WithClassName as any;
}
