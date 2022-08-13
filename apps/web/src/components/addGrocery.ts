import { define, natives } from '@aglio/wc2';

export const addGrocery = define<{}>(
	'add-grocery',
	({}, { ui, stylesheet }) => {
		stylesheet(`
    .add-grocery {
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
    }
  `);

		ui(
			natives.div({
				class: 'add-grocery',
				children: [
					natives.input({
						type: 'text',
						placeholder: 'Add grocery',
					}),
					natives.button({
						children: ['Add'],
					}),
				],
			}),
		);
	},
);
