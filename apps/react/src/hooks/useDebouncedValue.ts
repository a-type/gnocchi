import { useStableCallback } from '@a-type/ui/hooks';
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(
	value: T | (() => T),
	duration = 500,
	dependencies: any[] = [],
) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const getValue = useStableCallback(
		typeof value === 'function' ? value : ((() => value) as any),
	);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedValue(getValue());
		}, duration);
		return () => {
			clearTimeout(timeout);
		};
	}, [getValue, ...dependencies]);
	return debouncedValue;
}
