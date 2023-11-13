import v34Schema from '../client/schemaVersions/v34.js';
import v35Schema from '../client/schemaVersions/v35.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v34Schema, v35Schema);
