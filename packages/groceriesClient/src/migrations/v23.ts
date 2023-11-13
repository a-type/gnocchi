import v22Schema, {
  MigrationTypes as V22Types,
} from "../client/schemaVersions/v22.js";
import v23Schema, {
  MigrationTypes as V23Types,
} from "../client/schemaVersions/v23.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v22Schema, v23Schema);
