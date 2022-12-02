import { ComponentType } from 'react';
import { clsx } from 'clsx';

export function withClassName<T extends ComponentType<any>>(
	Component: T,
	cs: string,
): T {
	const WithClassName = (props: any) => {
		const { className, ...rest } = props;
		return <Component {...rest} className={clsx(cs, className)} />;
	};
	return WithClassName as any;
}
