import v18Schema, {
  MigrationTypes as V18Types,
} from "../client/schemaVersions/v18.js";
import v19Schema, {
  MigrationTypes as V19Types,
} from "../client/schemaVersions/v19.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v18Schema, v19Schema);
