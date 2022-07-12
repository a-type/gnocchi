// SIGNED-SOURCE: <ceaf70d3625d81f035550bb73eb94c56>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as GroceryInputSpec } from "./GroceryInputSpec.js";
import GroceryItem from "./GroceryItem.js";
import { Data } from "./GroceryItem.js";

const spec: NodeSpecWithCreate<GroceryItem, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], GroceryItem.name);
    if (existing) {
      return existing;
    }
    const result = new GroceryItem(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "groceryitem",
  },

  outboundEdges: {
    inputs: {
      type: "foreignKey",
      sourceField: "id",
      destField: "itemId",
      get source() {
        return spec;
      },
      get dest() {
        return GroceryInputSpec;
      },
    },
  },
};

export default spec;
