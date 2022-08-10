// SIGNED-SOURCE: <9ccbf13daf8690a2ee680224e4db19fa>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as GroceryInputSpec } from "./GroceryInputSpec.js";
import GroceryItem from "../GroceryItem.js";
import { Data } from "./GroceryItemBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  listId: {
    encoding: "none",
  },
  categoryId: {
    encoding: "none",
  },
  createdAt: {
    encoding: "none",
  },
  totalQuantity: {
    encoding: "none",
  },
  purchasedQuantity: {
    encoding: "none",
  },
  unit: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
  sortKey: {
    encoding: "none",
  },
} as const;
const GroceryItemSpec: NodeSpecWithCreate<GroceryItem, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "undefined", "groceryitem");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new GroceryItem(ctx, data);
    ctx.cache.set(data["id"], result, "undefined", "groceryitem");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "groceryitem",
  },

  fields,

  outboundEdges: {
    inputs: {
      type: "foreignKey",
      sourceField: "id",
      destField: "itemId",
      get source() {
        return GroceryItemSpec;
      },
      get dest() {
        return GroceryInputSpec;
      },
    },
  },
};

export default GroceryItemSpec;
