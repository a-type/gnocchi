// SIGNED-SOURCE: <c7f8924e5be5c1855c8b18026a1ee307>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as GroceryItemSpec } from "./GroceryItemSpec.js";
import GroceryList from "./GroceryList.js";
import { Data } from "./GroceryList.js";

const spec: NodeSpecWithCreate<GroceryList, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], GroceryList.name);
    if (existing) {
      return existing;
    }
    const result = new GroceryList(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "grocerylist",
  },

  outboundEdges: {
    items: {
      type: "foreignKey",
      sourceField: "id",
      destField: "listId",
      get source() {
        return spec;
      },
      get dest() {
        return GroceryItemSpec;
      },
    },
  },
};

export default spec;
