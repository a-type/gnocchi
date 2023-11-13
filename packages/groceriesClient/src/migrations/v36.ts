import v35Schema from '../client/schemaVersions/v35.js';
import v36Schema from '../client/schemaVersions/v36.js';
import { createMigration } from '@verdant-web/store';

export default createMigration(v35Schema, v36Schema);
