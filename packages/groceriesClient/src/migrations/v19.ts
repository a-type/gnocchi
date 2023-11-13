import v18Schema from '../client/schemaVersions/v18.js';
import v19Schema from '../client/schemaVersions/v19.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v18Schema, v19Schema);
