import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useCallback } from 'react';

export function useUnitConversion(unit: string | null | undefined) {
	const [convertMap, setConvertMap] = useLocalStorage<Record<string, string>>(
		'unit-conversions',
		{},
	);
	const value = unit ? convertMap[unit] ?? undefined : undefined;
	const setValue = useCallback(
		(newValue: string | undefined) => {
			if (!unit) return;
			setConvertMap({ ...convertMap, [unit]: newValue });
		},
		[convertMap, setConvertMap, unit],
	);
	return [value, setValue] as const;
}
