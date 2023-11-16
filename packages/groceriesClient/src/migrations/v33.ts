import v32Schema, {
  MigrationTypes as V32Types,
} from "../client/schemaVersions/v32.js";
import v33Schema, {
  MigrationTypes as V33Types,
} from "../client/schemaVersions/v33.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v32Schema, v33Schema);
