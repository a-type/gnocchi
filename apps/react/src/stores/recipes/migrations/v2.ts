import v1Schema from "../client/schemaVersions/v1.js";
import v2Schema from "../client/schemaVersions/v2.js";
import { migrate } from "@lo-fi/web";

export default migrate(
  v1Schema,
  v2Schema,
  async ({ migrate, withDefaults }) => {
    // add or modify migration logic here
    // if a line has a type error, that indicates the shape of your models may have changed
    await migrate("recipes", (old) => withDefaults("recipes", old));
    await migrate("collections", (old) => withDefaults("collections", old));
  }
);
