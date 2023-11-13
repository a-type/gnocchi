import v30Schema, {
  MigrationTypes as V30Types,
} from "../client/schemaVersions/v30.js";
import v31Schema, {
  MigrationTypes as V31Types,
} from "../client/schemaVersions/v31.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v30Schema, v31Schema);
