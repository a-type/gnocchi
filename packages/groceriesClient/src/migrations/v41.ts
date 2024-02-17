import v40Schema, {
  MigrationTypes as V40Types,
} from "../client/schemaVersions/v40.js";
import v41Schema, {
  MigrationTypes as V41Types,
} from "../client/schemaVersions/v41.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V40Types, V41Types>(
  v40Schema,
  v41Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
