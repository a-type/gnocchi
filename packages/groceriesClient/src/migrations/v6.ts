import v5Schema from '../client/schemaVersions/v5.js';
import v6Schema from '../client/schemaVersions/v6.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v5Schema, v6Schema);
