import classNames from 'classnames';
import {
	ComponentPropsWithRef,
	ComponentType,
	ElementType,
	FunctionComponent,
	forwardRef,
} from 'react';

export function withClassName<T extends ComponentType<any> | ElementType<any>>(
	Component: T,
	...cs: Parameters<typeof classNames>
): FunctionComponent<ComponentPropsWithRef<T>> {
	const WithClassName = forwardRef<any, any>((props, ref) => {
		const { className, ...rest } = props;
		return (
			<Component ref={ref} {...rest} className={classNames(cs, className)} />
		);
	});
	return WithClassName as any;
}
