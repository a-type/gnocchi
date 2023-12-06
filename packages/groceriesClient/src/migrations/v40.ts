import v39Schema, {
  MigrationTypes as V39Types,
} from "../client/schemaVersions/v39.js";
import v40Schema, {
  MigrationTypes as V40Types,
} from "../client/schemaVersions/v40.js";
import { createMigration } from "@verdant-web/store";

export default createMigration<V39Types, V40Types>(
  v39Schema,
  v40Schema,
  async ({ migrate }) => {
    // add or modify migration logic here. you must provide migrations for
    // any collections that have changed field types or added new non-nullable
    // fields without defaults
    // await migrate('collectionName', async (old) => ({ /* new */ }));
  },
);
