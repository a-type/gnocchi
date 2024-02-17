import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { hooks } from '@/stores/groceries/index.js';
import { Category, Food, Item } from '@aglio/groceries-client';
import { shortenTimeUnits } from '@aglio/tools';
import {
	useNavigate,
	useParams,
	useSearchParams,
} from '@verdant-web/react-router';
import addDays from 'date-fns/addDays';
import endOfDay from 'date-fns/endOfDay';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { useCallback, useMemo } from 'react';

// keeping this static to make the query reusable
export const THREE_DAYS_FROM_NOW = addDays(endOfDay(new Date()), 3).getTime();
export function useExpiresSoonItems({
	skip,
	key,
}: { skip?: boolean; key?: string } = {}) {
	return hooks.useAllFoodsUnsuspended({
		index: {
			where: 'purchasedAndExpiresAt',
			lt: THREE_DAYS_FROM_NOW,
		},
		skip,
		key,
	}).data;
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

export function useExpiresText(food: Food | null, abbreviate = false) {
	hooks.useWatch(food);
	const expiresAt = food?.get('expiresAt');
	if (!expiresAt) return '';
	const inThePast = expiresAt < Date.now();
	const toNow = formatDistanceToNowStrict(expiresAt, { addSuffix: true });
	return `${inThePast ? 'Expired' : 'Expires'} ${
		abbreviate ? shortenTimeUnits(toNow) : toNow
	}`;
}

export function usePurchasedText(food: Food | null, abbreviate = false) {
	hooks.useWatch(food);
	const purchasedAt = food?.get('lastPurchasedAt');
	if (!purchasedAt) return '';
	const toNow = formatDistanceToNowStrict(purchasedAt, { addSuffix: true });
	return `Purchased ${abbreviate ? shortenTimeUnits(toNow) : toNow}`;
}

/**
 * Uses a query parameter to decide whether to show all
 * items or only purchased items. Defaults to purchased.
 */
export function useFilter() {
	const [params, setParams] = useSearchParams();
	const filter: 'purchased' | 'all' | 'frozen' =
		(params.get('filter') as any) ?? 'purchased';
	const setFilter = (filter: 'purchased' | 'all' | 'frozen') => {
		setParams((old) => {
			old.set('filter', filter);
			return old;
		});
	};
	return [filter, setFilter] as const;
}

export function useSearch() {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get('query') || '';
	const setSearch = useCallback(
		(search: string) => {
			if (!search) {
				navigate(`/pantry`);
				return;
			} else {
				navigate(
					`/pantry/search?query=${encodeURIComponent(search.toLowerCase())}`,
				);
			}
		},
		[setSearchParams, navigate],
	);
	return [query.toLowerCase(), setSearch] as const;
}
