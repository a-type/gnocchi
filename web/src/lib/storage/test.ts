import { collection, createStorage } from './Storage';

const foo2Collection = collection({
	name: 'foo2',
	historicalSchemas: [],
	schema: {
		version: 1,
		fields: {
			hello: {
				type: 'string',
			},
			world: {
				type: 'number',
			},
		},
		synthetics: {
			again: {
				type: '#number',
				compute: (doc) => doc.hello.length,
			},
		},
		indexes: ['hello', 'again'],
		unique: [],
	},
});

const barCollection = collection({
	name: 'bar',
	historicalSchemas: [],
	schema: {
		version: 1,
		fields: {
			agh: {
				type: 'boolean',
			},
		},
		synthetics: {},
		indexes: ['agh'],
		unique: [],
	},
});

async function test() {
	const storage = await createStorage({
		collections: {
			foo: foo2Collection,
			bar: barCollection,
		},
	});

	const foo = storage.get('foo');

	foo.findOne('hello', '1');
	foo.findOne('again', 1);
	// @ts-expect-error
	foo.findOne('again', '1');
	// @ts-expect-error
	foo.findOne('world', '1');

	const bar = storage.get('bar');
	const thing = await bar.findOne('agh', true);
	thing.agh;

	// @ts-expect-error
	thing.hello;

	thing.id;
}
