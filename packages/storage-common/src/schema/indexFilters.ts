import {
	CollectionIndex,
	CollectionIndexFilter,
	MatchCollectionIndexFilter,
	RangeCollectionIndexFilter,
	StorageCollectionSchema,
} from './types.js';

export function isMatchIndexFilter<
	C extends StorageCollectionSchema<any, any>,
	I extends CollectionIndex<C>,
>(
	filter: CollectionIndexFilter<C, I>,
): filter is MatchCollectionIndexFilter<C, I> {
	return !!(filter as any).equals;
}

export function isRangeIndexFilter<
	C extends StorageCollectionSchema<any, any>,
	I extends CollectionIndex<C>,
>(
	filter: CollectionIndexFilter<C, I>,
): filter is RangeCollectionIndexFilter<C, I> {
	return (
		!!(filter as any).gte ||
		!!(filter as any).lte ||
		!!(filter as any).gt ||
		!!(filter as any).lt
	);
}
