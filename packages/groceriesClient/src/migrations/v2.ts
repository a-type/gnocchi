import { createMigration } from "@verdant-web/store";
import v1Schema, {
  MigrationTypes as V1Types,
} from "../client/schemaVersions/v1.js";
import v2Schema, {
  MigrationTypes as V2Types,
} from "../client/schemaVersions/v2.js";

export default createMigration(v1Schema, v2Schema);
