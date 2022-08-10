// SIGNED-SOURCE: <c4db7e0094cd71d7db84f21637ced36a>
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
import GroceryCategory from "../GroceryCategory.js";
import { Data } from "./GroceryCategoryBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  name: {
    encoding: "none",
  },
} as const;
const GroceryCategorySpec: NodeSpecWithCreate<GroceryCategory, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "undefined", "grocerycategory");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new GroceryCategory(ctx, data);
    ctx.cache.set(data["id"], result, "undefined", "grocerycategory");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "grocerycategory",
  },

  fields,

  outboundEdges: {
    items: {
      type: "foreignKey",
      sourceField: "id",
      destField: "categoryId",
      get source() {
        return GroceryCategorySpec;
      },
      get dest() {
        return GroceryItemSpec;
      },
    },
  },
};

export default GroceryCategorySpec;
