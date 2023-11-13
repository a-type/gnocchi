import v17Schema from '../client/schemaVersions/v17.js';
import v18Schema from '../client/schemaVersions/v18.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v17Schema, v18Schema);
