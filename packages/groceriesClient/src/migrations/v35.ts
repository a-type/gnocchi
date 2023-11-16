import v34Schema, {
  MigrationTypes as V34Types,
} from "../client/schemaVersions/v34.js";
import v35Schema, {
  MigrationTypes as V35Types,
} from "../client/schemaVersions/v35.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v34Schema, v35Schema);
