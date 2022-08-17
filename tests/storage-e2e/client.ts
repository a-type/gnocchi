import { collection, Storage } from '@aglio/storage';

const path = window.location.pathname;
const id = path.split('/').pop();

const schema = {
	todo: collection({
		name: 'todo',
		schema: {
			fields: {
				id: {
					type: 'string',
					indexed: true,
					unique: true,
				},
				title: {
					type: 'string',
					indexed: true,
					unique: false,
				},
				done: {
					type: 'boolean',
				},
				tags: {
					type: 'array',
					items: {
						type: 'string',
						indexed: false,
						unique: false,
					},
				},
			},
			synthetics: {},
			primaryKey: 'id',
			version: 1,
		},
	}),
};

const client = new Storage(schema);

window.client = client;

declare global {
	interface Window {
		client: Storage<any>;
	}
}
