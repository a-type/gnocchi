import { define, natives } from '@aglio/wc2';
import { addGrocery } from './addGrocery';
import { groceryList } from './groceryList';

define<{}>('app', ({}, { ui }) => {
	ui(
		natives.div({
			children: ['Aglio', addGrocery({}), groceryList({})],
		}),
	);
});
