import { useSearch } from '@/components/pantry/hooks.js';
import { PantryListItem } from '@/components/pantry/items/PantryListItem.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Button } from '@a-type/ui/components/button';
import { CardGrid } from '@a-type/ui/components/card';

export interface PantrySearchResultsProps {}

export function PantrySearchResults({}: PantrySearchResultsProps) {
	const [search] = useSearch();
	const [results, pagination] = hooks.useAllFoodsInfinite({
		index: {
			where: 'nameLookup',
			startsWith: search.toLowerCase(),
		},
		key: 'food-search',
	});

	if (!results.length) {
		return <div>No results</div>;
	}

	return (
		<div className="flex flex-col gap-4 items-center">
			<CardGrid className="grid-cols-[repeat(2,1fr)] w-full">
				{results.map((item) => {
					return <PantryListItem key={item.get('canonicalName')} item={item} />;
				})}
			</CardGrid>
			{pagination.hasMore && (
				<Button color="ghost" onClick={pagination.loadMore}>
					Load more
				</Button>
			)}
		</div>
	);
}
