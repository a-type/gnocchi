import v14Schema from '../client/schemaVersions/v14.js';
import v15Schema from '../client/schemaVersions/v15.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v14Schema, v15Schema);
