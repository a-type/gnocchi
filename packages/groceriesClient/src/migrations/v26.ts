import v25Schema from '../client/schemaVersions/v25.js';
import v26Schema from '../client/schemaVersions/v26.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v25Schema, v26Schema);
