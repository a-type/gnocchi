import v19Schema, {
  MigrationTypes as V19Types,
} from "../client/schemaVersions/v19.js";
import v20Schema, {
  MigrationTypes as V20Types,
} from "../client/schemaVersions/v20.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v19Schema, v20Schema);
