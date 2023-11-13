import v6Schema from '../client/schemaVersions/v6.js';
import v7Schema from '../client/schemaVersions/v7.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v6Schema, v7Schema);
