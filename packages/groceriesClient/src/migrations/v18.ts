import v17Schema, {
  MigrationTypes as V17Types,
} from "../client/schemaVersions/v17.js";
import v18Schema, {
  MigrationTypes as V18Types,
} from "../client/schemaVersions/v18.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v17Schema, v18Schema);
