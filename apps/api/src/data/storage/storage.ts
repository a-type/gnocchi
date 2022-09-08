import { ServerStorage, UserProfiles } from '@aglio/storage-server';
import { assert } from '@aglio/tools';
import create from 'better-sqlite3';
import { prisma } from '../prisma.js';
import { outgoingMessages } from './outgoingMessages.js';

const storageDbFile = process.env.STORAGE_DATABASE_URL;
assert(!!storageDbFile, 'STORAGE_DATABASE_URL is not set');

const storageDb = create(storageDbFile);

class Profiles implements UserProfiles<any> {
	get = (userId: string) => {
		return prisma.profile.findUnique({ where: { id: userId } });
	};
}

export const storage = new ServerStorage(
	storageDb,
	outgoingMessages,
	new Profiles(),
);
