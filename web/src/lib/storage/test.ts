import { collection, Storage } from './Storage';

export const fooCollection = collection({
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

export const barCollection = collection({
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
	const storage = new Storage({
		foo: fooCollection,
		bar: barCollection,
	});

	const foo = storage.get('foo');

	foo.findOne('hello', '1');
	foo.findOne('again', 1);
	// @ts-expect-error
	foo.findOne('again', '1');
	// @ts-expect-error
	foo.findOne('world', '1');

	const bar = storage.get('bar');
	const thing = bar.findOne('agh', true);
	thing.current?.agh;

	// @ts-expect-error
	thing.current?.hello;

	thing.current?.id;
}
