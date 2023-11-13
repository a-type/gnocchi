import v27Schema from '../client/schemaVersions/v27.js';
import v28Schema from '../client/schemaVersions/v28.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v27Schema, v28Schema);
