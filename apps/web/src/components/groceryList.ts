import { define, natives, view, map } from '@aglio/wc2';
import { groceries } from 'stores/groceries';

export const groceryList = define<{}>(
	'grocery-list',
	async ({}, { ui, stylesheet, watch }) => {
		stylesheet(`
      .categories {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `);

		// roughly:

		// 1. show an initial loading state
		// 2. spin up our category query
		// 3. when categories are ready, hide the loading state.
		// 4. for each category, render a category view
		// 5. when categories change, update our rendered views,
		//    adding and removing views as necessary.

		const loading = ui(
			natives.div({
				children: ['Loading...'],
			}),
		);

		const categoriesResult = await groceries.listCategories();
		await categoriesResult.__currentHandle;
		const categories = view(
			(cb) => categoriesResult.subscribe(cb),
			() => categoriesResult.latest!,
		);

		loading.cleanup();

		ui(
			natives.div({
				class: 'categories',
				children: map(categories, (dataList) => {
					return dataList.map((data) => {
						return groceryListCategory({
							categoryId: data.id,
						});
					});
				}),
			}),
		);
	},
);

const groceryListCategory = define<{ categoryId: string }>(
	'grocery-list-category',
	({ categoryId }, { ui, stylesheet }) => {
		ui(
			natives.div({
				children: ['Category: ', categoryId],
			}),
		);
	},
);
