// SIGNED-SOURCE: <167a2ca622936d566b0fc9e3c59fdbb3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import GroceryFoodCategoryLookup from "../GroceryFoodCategoryLookup.js";
import { Data } from "./GroceryFoodCategoryLookupBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  categoryId: {
    encoding: "none",
  },
} as const;
const GroceryFoodCategoryLookupSpec: NodeSpecWithCreate<
  GroceryFoodCategoryLookup,
  Data
> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(
      data["id"],
      "undefined",
      "groceryfoodcategorylookup"
    );
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new GroceryFoodCategoryLookup(ctx, data);
    ctx.cache.set(data["id"], result, "undefined", "groceryfoodcategorylookup");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "groceryfoodcategorylookup",
  },

  fields,

  outboundEdges: {},
};

export default GroceryFoodCategoryLookupSpec;
