import v21Schema, {
  MigrationTypes as V21Types,
} from "../client/schemaVersions/v21.js";
import v22Schema, {
  MigrationTypes as V22Types,
} from "../client/schemaVersions/v22.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v21Schema, v22Schema);
