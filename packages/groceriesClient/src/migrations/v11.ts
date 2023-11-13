import v10Schema from '../client/schemaVersions/v10.js';
import v11Schema from '../client/schemaVersions/v11.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v10Schema, v11Schema);
