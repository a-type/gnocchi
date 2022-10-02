import { prisma } from '../index.js';

const DEFAULT_CATEGORIES = [
	'Dairy & Eggs',
	'Produce',
	'Meat & Seafood',
	'Bakery',
	'Beverages',
	'Frozen',
	'Canned Goods',
	'Pantry',
	'Snacks',
	'Personal Care',
	'Household',
];

(async function run() {
	await prisma.defaultCategory.upsert({
		where: { id: 'None' },
		create: {
			id: 'None',
			name: 'None',
		},
		update: {},
	});

	for (const name of DEFAULT_CATEGORIES) {
		const existing = await prisma.defaultCategory.findFirst({
			where: { name },
		});
		if (!existing) {
			await prisma.defaultCategory.create({
				data: {
					name,
				},
			});
		}
	}
})();
