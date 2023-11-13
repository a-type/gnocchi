import { createMigration } from "@verdant-web/store";
import v3Schema, {
  MigrationTypes as V3Types,
} from "../client/schemaVersions/v3.js";
import v4Schema, {
  MigrationTypes as V4Types,
} from "../client/schemaVersions/v4.js";

export default createMigration(v3Schema, v4Schema);
