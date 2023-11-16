import { createMigration } from "@verdant-web/store";
import v1Schema, {
  MigrationTypes as V1Types,
} from "../client/schemaVersions/v1.js";

export default createMigration<V1Types>(v1Schema);
