import v19Schema from '../client/schemaVersions/v19.js';
import v20Schema from '../client/schemaVersions/v20.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v19Schema, v20Schema);
