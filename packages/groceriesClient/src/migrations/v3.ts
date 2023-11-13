import { createMigration } from '@verdant-web/store';
import v2Schema from '../client/schemaVersions/v2.js';
import v3Schema from '../client/schemaVersions/v3.js';

export default createMigration(v2Schema, v3Schema);
