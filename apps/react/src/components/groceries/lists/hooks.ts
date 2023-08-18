import { hooks } from '@/stores/groceries/index.js';

export function useListThemeClass(listId: string | null | undefined) {
	const list = useListOrNull(listId);
	const color = list?.get('color') || 'lemon';
	return `theme-${color}`;
}

export function useListOrNull(listId: string | null | undefined) {
	return hooks.useList(listId || '', {
		skip: !listId,
	});
}
