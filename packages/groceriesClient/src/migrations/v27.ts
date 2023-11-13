import v26Schema, {
  MigrationTypes as V26Types,
} from "../client/schemaVersions/v26.js";
import v27Schema, {
  MigrationTypes as V27Types,
} from "../client/schemaVersions/v27.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v26Schema, v27Schema);
