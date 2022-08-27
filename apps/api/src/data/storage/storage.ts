import { ServerStorage } from '@aglio/storage-server';
import { assert } from '@aglio/tools';
import create from 'better-sqlite3';
import { outgoingMessages } from './outgoingMessages.js';

const storageDbFile = process.env.STORAGE_DATABASE_URL;
assert(!!storageDbFile, 'STORAGE_DATABASE_URL is not set');

const storageDb = create(storageDbFile);

export const storage = new ServerStorage(storageDb, outgoingMessages);
