import { Item } from '@/stores/groceries/index.js';
import pluralize from 'pluralize';

export function useItemDisplayText(item: Item) {
	const inputs = item.get('inputs');

	const pluralizedUnit = item.get('unit')
		? item.get('totalQuantity') === 1
			? item.get('unit')
			: pluralize(item.get('unit'))
		: '';
	const pluralizedName =
		item.get('totalQuantity') === 1
			? item.get('food')
			: pluralize(item.get('food'));
	const showOnlyInput = inputs.length === 1;
	const displayString = showOnlyInput
		? inputs.get(0).get('text')
		: `${pluralizedUnit && `${pluralizedUnit} `}${pluralizedName}`;

	return displayString;
}
