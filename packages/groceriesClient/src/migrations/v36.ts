import v35Schema, {
  MigrationTypes as V35Types,
} from "../client/schemaVersions/v35.js";
import v36Schema, {
  MigrationTypes as V36Types,
} from "../client/schemaVersions/v36.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v35Schema, v36Schema);
