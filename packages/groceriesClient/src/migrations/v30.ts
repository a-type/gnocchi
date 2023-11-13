import v29Schema from '../client/schemaVersions/v29.js';
import v30Schema from '../client/schemaVersions/v30.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v29Schema, v30Schema);
