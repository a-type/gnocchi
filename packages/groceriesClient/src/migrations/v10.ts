import v9Schema, {
  MigrationTypes as V9Types,
} from "../client/schemaVersions/v9.js";
import v10Schema, {
  MigrationTypes as V10Types,
} from "../client/schemaVersions/v10.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v9Schema, v10Schema);
