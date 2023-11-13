import v28Schema from '../client/schemaVersions/v28.js';
import v29Schema from '../client/schemaVersions/v29.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v28Schema, v29Schema);
