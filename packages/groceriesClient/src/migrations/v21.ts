import v20Schema, {
	MigrationTypes as V20SchemaTypes,
} from '../client/schemaVersions/v20.js';
import v21Schema, {
	MigrationTypes as V21SchemaTypes,
} from '../client/schemaVersions/v21.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V20SchemaTypes, V21SchemaTypes>(
	v20Schema,
	v21Schema,
	async ({ queries, mutations }) => {
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
	},
);
