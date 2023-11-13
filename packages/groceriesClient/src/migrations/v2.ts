import { createMigration } from '@verdant-web/store';
import v1Schema from '../client/schemaVersions/v1.js';
import v2Schema from '../client/schemaVersions/v2.js';

export default createMigration(v1Schema, v2Schema);
