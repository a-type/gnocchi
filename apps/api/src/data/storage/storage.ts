import { ServerStorage } from '@aglio/storage-server';
import create, { Database } from 'better-sqlite3';
import { outgoingMessages } from './outgoingMessages.js';

const storageDb = create('./storage.sqlite');

export const storage = new ServerStorage(storageDb, outgoingMessages);
