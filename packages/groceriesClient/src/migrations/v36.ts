import v35Schema from "../client/schemaVersions/v35.js";
import v36Schema from "../client/schemaVersions/v36.js";
import { migrate } from "@verdant-web/store";

export default migrate(v35Schema, v36Schema, async ({ migrate }) => {
  // add or modify migration logic here. you must provide migrations for
  // any collections that have changed field types or added new non-nullable
  // fields without defaults
  // migrate('collectionName', async (old) => ({ /* new */ }));
});
