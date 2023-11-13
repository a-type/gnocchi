import v12Schema from '../client/schemaVersions/v12.js';
import v13Schema from '../client/schemaVersions/v13.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v12Schema, v13Schema);
