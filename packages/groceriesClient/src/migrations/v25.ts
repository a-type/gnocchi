import v24Schema, {
  MigrationTypes as V24Types,
} from "../client/schemaVersions/v24.js";
import v25Schema, {
  MigrationTypes as V25Types,
} from "../client/schemaVersions/v25.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v24Schema, v25Schema);
