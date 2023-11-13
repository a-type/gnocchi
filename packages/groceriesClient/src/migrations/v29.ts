import v28Schema, {
  MigrationTypes as V28Types,
} from "../client/schemaVersions/v28.js";
import v29Schema, {
  MigrationTypes as V29Types,
} from "../client/schemaVersions/v29.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v28Schema, v29Schema);
