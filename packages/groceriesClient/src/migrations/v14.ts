import v13Schema, {
  MigrationTypes as V13Types,
} from "../client/schemaVersions/v13.js";
import v14Schema, {
  MigrationTypes as V14Types,
} from "../client/schemaVersions/v14.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v13Schema, v14Schema);
