// SIGNED-SOURCE: <706e37e33b7d850b6b6b3b3bcbac63fd>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as GroceryItemSpec } from "./GroceryItemSpec.js";
import GroceryList from "../GroceryList.js";
import { Data } from "./GroceryListBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
} as const;
const GroceryListSpec: NodeSpecWithCreate<GroceryList, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "undefined", "grocerylist");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new GroceryList(ctx, data);
    ctx.cache.set(data["id"], result, "undefined", "grocerylist");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "grocerylist",
  },

  fields,

  outboundEdges: {
    items: {
      type: "foreignKey",
      sourceField: "id",
      destField: "listId",
      get source() {
        return GroceryListSpec;
      },
      get dest() {
        return GroceryItemSpec;
      },
    },
  },
};

export default GroceryListSpec;
