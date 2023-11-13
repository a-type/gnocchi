import v9Schema from '../client/schemaVersions/v9.js';
import v10Schema from '../client/schemaVersions/v10.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v9Schema, v10Schema);
