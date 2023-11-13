import v10Schema, {
  MigrationTypes as V10Types,
} from "../client/schemaVersions/v10.js";
import v11Schema, {
  MigrationTypes as V11Types,
} from "../client/schemaVersions/v11.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v10Schema, v11Schema);
