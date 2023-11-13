import v30Schema from '../client/schemaVersions/v30.js';
import v31Schema from '../client/schemaVersions/v31.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v30Schema, v31Schema);
