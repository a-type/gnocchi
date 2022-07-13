// SIGNED-SOURCE: <5c0bec948c374e13d2e76a48c507518d>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import GroceryFoodCategoryLookup from "./GroceryFoodCategoryLookup.js";
import { Data } from "./GroceryFoodCategoryLookup.js";

const spec: NodeSpecWithCreate<GroceryFoodCategoryLookup, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], GroceryFoodCategoryLookup.name);
    if (existing) {
      return existing;
    }
    const result = new GroceryFoodCategoryLookup(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "groceryfoodcategorylookup",
  },

  outboundEdges: {},
};

export default spec;
