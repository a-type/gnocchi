import v26Schema from '../client/schemaVersions/v26.js';
import v27Schema from '../client/schemaVersions/v27.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v26Schema, v27Schema);
