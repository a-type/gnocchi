import v11Schema, {
  MigrationTypes as V11Types,
} from "../client/schemaVersions/v11.js";
import v12Schema, {
  MigrationTypes as V12Types,
} from "../client/schemaVersions/v12.js";
import { createMigration } from "@verdant-web/store";

export default createMigration(v11Schema, v12Schema, async ({ mutations }) => {
  await mutations.collaborationInfo.put({});
});
