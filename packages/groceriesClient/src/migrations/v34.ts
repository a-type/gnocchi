import v33Schema from '../client/schemaVersions/v33.js';
import v34Schema from '../client/schemaVersions/v34.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v33Schema, v34Schema);
