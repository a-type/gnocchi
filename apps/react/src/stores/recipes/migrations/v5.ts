import v4Schema from "../client/schemaVersions/v4.js";
import v5Schema from "../client/schemaVersions/v5.js";
import { migrate } from "@lo-fi/web";

export default migrate(
  v4Schema,
  v5Schema,
  async ({ migrate, withDefaults, info }) => {
    // add or modify migration logic here
    // if a line has a type error, that indicates the shape of your models may have changed
    await migrate("recipes", (old) => withDefaults("recipes", old));
    await migrate("collections", (old) => withDefaults("collections", old));
  }
);
