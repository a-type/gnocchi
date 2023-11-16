import v5Schema, {
  MigrationTypes as V5Types,
} from "../client/schemaVersions/v5.js";
import v6Schema, {
  MigrationTypes as V6Types,
} from "../client/schemaVersions/v6.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v5Schema, v6Schema);
