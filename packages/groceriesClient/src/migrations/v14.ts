import v13Schema from '../client/schemaVersions/v13.js';
import v14Schema from '../client/schemaVersions/v14.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v13Schema, v14Schema);
