import v22Schema from '../client/schemaVersions/v22.js';
import v23Schema from '../client/schemaVersions/v23.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v22Schema, v23Schema);
