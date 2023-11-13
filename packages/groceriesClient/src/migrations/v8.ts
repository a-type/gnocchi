import v7Schema, {
  MigrationTypes as V7Types,
} from "../client/schemaVersions/v7.js";
import v8Schema, {
  MigrationTypes as V8Types,
} from "../client/schemaVersions/v8.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v7Schema, v8Schema);
