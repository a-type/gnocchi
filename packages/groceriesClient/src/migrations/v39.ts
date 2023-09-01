import v38Schema from "../client/schemaVersions/v38.js";
import v39Schema from "../client/schemaVersions/v39.js";
import { migrate } from "@verdant-web/store";

export default migrate(v38Schema, v39Schema, async ({ migrate }) => {
  // add or modify migration logic here. you must provide migrations for
  // any collections that have changed field types or added new non-nullable
  // fields without defaults
  // migrate('collectionName', async (old) => ({ /* new */ }));
});
