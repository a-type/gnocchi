import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useDebouncedValue } from '@/hooks/useDebouncedValue.js';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { hooks } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { useMemo } from 'react';

export function useAISuggestions(): string[] {
	const enabled = useFeatureFlag('aiGroceries');
	const list = hooks.useAllItems({
		index: {
			where: 'purchased',
			equals: 'no',
		},
		skip: !enabled,
	});
	const items = useMemo(
		() => list.slice(0, 30).map((item) => item.get('food')),
		[list.length],
	);
	const memoizedItems = useDebouncedValue(items, 20 * 1000);

	const isSubscribed = useIsSubscribed();

	const { data } = trpc.suggestions.groceries.useQuery(memoizedItems, {
		enabled: isSubscribed && items.length > 0,
		staleTime: Infinity,
		cacheTime: Infinity,
	});

	return data?.suggestions ?? [];
}
