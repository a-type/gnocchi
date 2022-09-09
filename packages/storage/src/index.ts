export { Storage, storage } from './Storage.js';
export { StorageCollection } from './StorageCollection.js';
export type { CollectionInMemoryFilters } from './StorageCollection.js';
export { collection, schema } from '@aglio/storage-common';
export type { StorageDocument } from '@aglio/storage-common';
export { subscribe, LiveQuery } from './reactives/index.js';
export type { LiveDocument } from './reactives/index.js';

export interface Presence {}

export interface Profile {}

import type { UserInfo as BaseUserInfo } from '@aglio/storage-common';

export type UserInfo = BaseUserInfo<Profile, Presence>;
