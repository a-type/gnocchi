import { Item } from '@aglio/groceries-client';
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
	// try as much as we can to show the original text, not parsed.
	// If there's only one input and no multiplier or quantity editing
	// has happened, we can do that.
	const showOnlyInput =
		inputs.length === 1 &&
		(inputs.get(0).get('multiplier') === null ||
			inputs.get(0).get('multiplier') === 1) &&
		(inputs.get(0).get('quantity') === null ||
			inputs.get(0).get('quantity') === quantity);
	const displayString = showOnlyInput
		? `${inputs.get(0).get('text')}`
		: `${fractionToText(quantity)} ${
				pluralizedUnit && `${pluralizedUnit} `
		  }${pluralizedName}`;

	return displayString;
}
