export * from './v2/index.js';
export { collection, schema } from '@aglio/storage-common';
export type { StorageDocument } from '@aglio/storage-common';

export interface Presence {}

export interface Profile {}

import type { UserInfo as BaseUserInfo } from '@aglio/storage-common';

export type UserInfo = BaseUserInfo<Profile, Presence>;
