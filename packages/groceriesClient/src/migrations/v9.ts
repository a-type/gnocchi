import v8Schema from "../client/schemaVersions/v8.js";
import v9Schema from "../client/schemaVersions/v9.js";
import { migrate } from "@lo-fi/web";

export default migrate(
  v8Schema,
  v9Schema,
  async ({ migrate, withDefaults }) => {
    // add or modify migration logic here
    // if a line has a type error, that indicates the shape of your models may have changed
    await migrate("categories", (old) => withDefaults("categories", old));
    await migrate("items", (old) => withDefaults("items", old));
    await migrate("foodCategoryAssignments", (old) =>
      withDefaults("foodCategoryAssignments", old)
    );
    await migrate("suggestions", (old) => withDefaults("suggestions", old));
  }
);
