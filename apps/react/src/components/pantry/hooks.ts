import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { hooks } from '@/stores/groceries/index.js';
import { Category, Item } from '@aglio/groceries-client';
import {
	useNavigate,
	useParams,
	useSearchParams,
} from '@verdant-web/react-router';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import { useMemo } from 'react';

export function useItemsGroupedAndSorted() {
	const items =
		hooks.useAllItems({
			index: {
				where: 'purchased',
				equals: 'yes',
			},
		}) || [];
	const categories = hooks.useAllCategories() || [];
	return useMemo(() => {
		const categoryGroups: { category: Category | null; items: Item[] }[] = [];
		const sortedCategories: (Category | null)[] = categories
			.slice()
			.sort((a, b) => {
				if (a.get('sortKey') > b.get('sortKey')) return 1;
				if (a.get('sortKey') < b.get('sortKey')) return -1;
				return 0;
			});
		sortedCategories.push(null);

		const categoryIndexLookup = new Map<string | null, number>();
		for (const category of sortedCategories) {
			const group = {
				category,
				items: [],
			};
			categoryGroups.push(group);
			categoryIndexLookup.set(
				category?.get('id') ?? null,
				categoryGroups.length - 1,
			);
		}
		for (const item of items) {
			const categoryId = item.get('categoryId');
			const categoryIndex =
				categoryIndexLookup.get(categoryId) ?? categoryIndexLookup.get(null)!;
			categoryGroups[categoryIndex].items.push(item);
		}
		return { groupedItems: categoryGroups, empty: items.length === 0 };
	}, [items, categories]);
}

// keeping this static to make the query reusable
const THREE_DAYS_FROM_NOW = addDays(endOfDay(new Date()), 3).getTime();
export function useExpiresSoonItems({ skip }: { skip?: boolean } = {}) {
	return hooks.useAllFoods({
		index: {
			where: 'purchasedAndExpiresAt',
			lt: THREE_DAYS_FROM_NOW,
		},
		skip,
	});
}

// something weird is going on in this hook, or the
// way it's being called... I have to store this in
// module scope to keep it alive.
let newerExpireTime: number | undefined = undefined;
export function useHasNewExpirations() {
	const [latestSeen, setLatestSeen] = useLocalStorage(
		'latestSeenExpiration',
		Date.now(),
	);
	const expiresSoonItems = useExpiresSoonItems();
	const latestExpiration = expiresSoonItems.reduce((latest, item) => {
		const expiresAt = item.get('expiresAt')!;
		if (expiresAt > latest) return expiresAt;
		return latest;
	}, 0);
	newerExpireTime =
		latestExpiration > latestSeen ? latestExpiration : undefined;
	const onSeen = () => {
		if (newerExpireTime) {
			setLatestSeen(newerExpireTime);
		}
	};
	return [!!newerExpireTime, onSeen] as const;
}

/**
 * Uses a query parameter to decide whether to show all
 * items or only purchased items. Defaults to purchased.
 */
export function useFilter() {
	const [params, setParams] = useSearchParams();
	const filter: 'purchased' | 'all' =
		(params.get('filter') as any) ?? 'purchased';
	const setFilter = (filter: 'purchased' | 'all') => {
		setParams((old) => {
			old.set('filter', filter);
			return old;
		});
	};
	return [filter, setFilter] as const;
}

export function useSearch() {
	const navigate = useNavigate();
	const params = useParams<{ query?: string }>();
	const setSearch = (search: string) => {
		if (!search) {
			navigate('/pantry');
			return;
		} else {
			navigate(`/pantry/search/${encodeURIComponent(search)}`);
		}
	};
	return [params.query || '', setSearch] as const;
}
