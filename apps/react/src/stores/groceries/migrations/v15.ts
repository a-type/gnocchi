import v14Schema from "../client/schemaVersions/v14.js";
import v15Schema from "../client/schemaVersions/v15.js";
import { migrate } from "@lo-fi/web";

export default migrate(
  v14Schema,
  v15Schema,
  async ({ migrate, withDefaults }) => {
    // add or modify migration logic here
    // if a line has a type error, that indicates the shape of your models may have changed
    await migrate("categories", (old) => withDefaults("categories", old));
    await migrate("items", (old) => withDefaults("items", old));
    await migrate("foodCategoryAssignments", (old) =>
      withDefaults("foodCategoryAssignments", old)
    );
    await migrate("suggestions", (old) => withDefaults("suggestions", old));
    await migrate("lists", (old) => withDefaults("lists", old));
    await migrate("collaborationInfo", (old) =>
      withDefaults("collaborationInfo", old)
    );
  }
);
