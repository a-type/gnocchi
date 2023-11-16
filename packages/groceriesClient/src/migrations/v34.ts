import v33Schema, {
  MigrationTypes as V33Types,
} from "../client/schemaVersions/v33.js";
import v34Schema, {
  MigrationTypes as V34Types,
} from "../client/schemaVersions/v34.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v33Schema, v34Schema);
