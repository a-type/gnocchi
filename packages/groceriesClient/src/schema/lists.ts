import { schema } from '@verdant-web/common';
import cuid from 'cuid';

export const lists = schema.collection({
	name: 'list',
	primaryKey: 'id',
	fields: {
		id: schema.fields.string({
			default: () => cuid(),
		}),
		name: schema.fields.string(),
		color: schema.fields.string(),
	},
});
