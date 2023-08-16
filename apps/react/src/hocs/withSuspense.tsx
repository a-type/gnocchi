import { ComponentProps, ComponentType, ElementType, Suspense } from 'react';

export function withSuspense<T extends ComponentType<any> | ElementType<any>>(
	Component: T,
	fallback?: React.ReactNode,
) {
	return (props: ComponentProps<T>) => (
		<Suspense fallback={fallback || null}>
			<Component {...props} />
		</Suspense>
	);
}
