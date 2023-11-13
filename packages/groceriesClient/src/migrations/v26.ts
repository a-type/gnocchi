import v25Schema, {
  MigrationTypes as V25Types,
} from "../client/schemaVersions/v25.js";
import v26Schema, {
  MigrationTypes as V26Types,
} from "../client/schemaVersions/v26.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v25Schema, v26Schema);
