import v21Schema from '../client/schemaVersions/v21.js';
import v22Schema from '../client/schemaVersions/v22.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v21Schema, v22Schema);
