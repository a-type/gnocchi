import { hooks } from '@/stores/groceries/index.js';
import { themeMap } from '@/styles/themes/map.js';
import { useSyncExternalStore } from 'react';

// TODO: add optional/skippable query hooks to lo-fi/react
export function useListThemeClass(listId: string | null | undefined) {
	const list = useListOrNull(listId);
	const color = list?.get('color') || 'lemon';
	const matchingTheme =
		themeMap[color as keyof typeof themeMap] ?? themeMap.lemon;
	return matchingTheme;
}

export function useListOrNull(listId: string | null | undefined) {
	const client = hooks.useClient();
	const query = listId ? client.lists.get(listId) : null;
	const list = useSyncExternalStore(
		(cb) => query?.subscribe(cb) ?? (() => {}),
		() => query?.current ?? null,
	);
	hooks.useWatch(list);
	return list;
}
