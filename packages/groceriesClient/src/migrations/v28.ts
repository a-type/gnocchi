import v27Schema, {
  MigrationTypes as V27Types,
} from "../client/schemaVersions/v27.js";
import v28Schema, {
  MigrationTypes as V28Types,
} from "../client/schemaVersions/v28.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v27Schema, v28Schema);
