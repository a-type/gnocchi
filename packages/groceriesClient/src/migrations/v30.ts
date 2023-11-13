import v29Schema, {
  MigrationTypes as V29Types,
} from "../client/schemaVersions/v29.js";
import v30Schema, {
  MigrationTypes as V30Types,
} from "../client/schemaVersions/v30.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v29Schema, v30Schema);
