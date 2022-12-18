import { Item } from '@/stores/groceries/index.js';
import { fractionToText } from '@aglio/tools';
import pluralize from 'pluralize';

export function useItemDisplayText(item: Item) {
	const inputs = item.get('inputs');

	const quantity = item.get('totalQuantity');
	const pluralizedUnit = item.get('unit')
		? item.get('totalQuantity') === 1
			? item.get('unit')
			: pluralize(item.get('unit'))
		: '';
	const pluralizedName =
		item.get('totalQuantity') === 1 || item.get('unit')
			? item.get('food')
			: pluralize(item.get('food'));
	const showOnlyInput =
		inputs.length === 1 &&
		(inputs.get(0).get('multiplier') === null ||
			inputs.get(0).get('multiplier') === 1);
	const displayString = showOnlyInput
		? inputs.get(0).get('text')
		: `${fractionToText(quantity)} ${
				pluralizedUnit && `${pluralizedUnit} `
		  }${pluralizedName}`;

	return displayString;
}
