import { createMigration } from "@verdant-web/store";
import v2Schema, {
  MigrationTypes as V2Types,
} from "../client/schemaVersions/v2.js";
import v3Schema, {
  MigrationTypes as V3Types,
} from "../client/schemaVersions/v3.js";

export default createMigration(v2Schema, v3Schema);
