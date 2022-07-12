import { CreateArgs } from './GroceryInputMutations.js';
import { Changeset, sid } from '@aphro/runtime-ts';
import { Data } from './GroceryInput.js';
import GroceryInput from './GroceryInput.js';
import { IMutationBuilder } from '@aphro/runtime-ts';

export function createImpl(
	mutator: Omit<IMutationBuilder<GroceryInput, Data>, 'toChangeset'>,
	{ itemId, text }: CreateArgs,
): void | Changeset<any>[] {
	mutator.set({
		id: sid('AAAA'),
		itemId,
		text,
	});
}
