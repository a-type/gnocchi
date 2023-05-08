import v20Schema from '../client/schemaVersions/v20.js';
import v21Schema from '../client/schemaVersions/v21.js';
import { migrate } from '@verdant-web/web';

export default migrate(v20Schema, v21Schema, async ({ queries, mutations }) => {
	const oldAssignments = await queries.foodCategoryAssignments.findAll();
	for (const assignment of oldAssignments) {
		await mutations.foods.put({
			categoryId: assignment.categoryId,
			isPerishable: null,
			isStaple: false,
			canonicalName: assignment.foodName,
			alternateNames: [assignment.foodName],
		});
	}
});
