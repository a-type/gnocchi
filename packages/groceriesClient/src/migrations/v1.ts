import { createDefaultMigration } from '@lo-fi/web';
import v1Schema from '../client/schemaVersions/v1.js';

export default createDefaultMigration(v1Schema);
