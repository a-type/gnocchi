// SIGNED-SOURCE: <cb4d0cbc131efeb2346c5a90385fb567>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
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
