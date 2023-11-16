import v8Schema, {
  MigrationTypes as V8Types,
} from "../client/schemaVersions/v8.js";
import v9Schema, {
  MigrationTypes as V9Types,
} from "../client/schemaVersions/v9.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v8Schema, v9Schema);
