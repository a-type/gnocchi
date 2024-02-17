import { schema } from '@verdant-web/store';

export const collaborationInfo = schema.collection({
	name: 'collaborationInfo',
	pluralName: 'collaborationInfo',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: 'default',
		}),
		meetup: schema.fields.object({
			nullable: true,
			properties: {
				createdAt: schema.fields.number({
					default: () => Date.now(),
				}),
				location: schema.fields.string(),
			},
		}),
	},
});
