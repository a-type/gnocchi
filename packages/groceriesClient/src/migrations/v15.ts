import v14Schema, {
  MigrationTypes as V14Types,
} from "../client/schemaVersions/v14.js";
import v15Schema, {
  MigrationTypes as V15Types,
} from "../client/schemaVersions/v15.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v14Schema, v15Schema);
