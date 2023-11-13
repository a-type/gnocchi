import { createMigration } from '@verdant-web/store';
import v3Schema from '../client/schemaVersions/v3.js';
import v4Schema from '../client/schemaVersions/v4.js';

export default createMigration(v3Schema, v4Schema);
