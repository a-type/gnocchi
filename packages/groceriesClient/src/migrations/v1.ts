import { createDefaultMigration } from '@verdant-web/store';
import v1Schema from '../client/schemaVersions/v1.js';

export default createDefaultMigration(v1Schema);
