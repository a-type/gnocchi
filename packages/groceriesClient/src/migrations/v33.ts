import v32Schema from '../client/schemaVersions/v32.js';
import v33Schema from '../client/schemaVersions/v33.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v32Schema, v33Schema);
