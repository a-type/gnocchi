import { schema } from '@verdant-web/common';

/**
 * I'm keeping this practically only to serve as a lookup for what
 * tags have been created so they can be reused.
 */
export const recipeTagMetadata = schema.collection({
	name: 'recipeTagMetadata',
	primaryKey: 'name',
	pluralName: 'recipeTagMetadata',
	fields: {
		name: schema.fields.string(),
		color: schema.fields.string({
			nullable: true,
		}),
		icon: schema.fields.string({
			nullable: true,
		}),
	},
});
