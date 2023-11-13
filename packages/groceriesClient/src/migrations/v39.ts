import v38Schema, {
	MigrationTypes as V38Types,
} from '../client/schemaVersions/v38.js';
import v39Schema, {
	MigrationTypes as V39Types,
} from '../client/schemaVersions/v39.js';
import { createMigration } from '@verdant-web/store';

export default createMigration<V38Types, V39Types>(v38Schema, v39Schema);
