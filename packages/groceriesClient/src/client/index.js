import schema from './schema.js';
import { Storage, StorageDescriptor } from '@verdant-web/web';
export * from '@verdant-web/web';

export const Client = Storage;
export class ClientDescriptor extends StorageDescriptor {
	constructor(init) {
		super({ ...init, schema });
	}
}
