import v31Schema from '../client/schemaVersions/v31.js';
import v32Schema from '../client/schemaVersions/v32.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v31Schema, v32Schema);
