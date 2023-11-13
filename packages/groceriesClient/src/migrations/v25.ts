import v24Schema from '../client/schemaVersions/v24.js';
import v25Schema from '../client/schemaVersions/v25.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v24Schema, v25Schema);
