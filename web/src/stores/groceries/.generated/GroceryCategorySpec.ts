// SIGNED-SOURCE: <fd3120186a3e9ad29f3ac30f60cab8f1>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { default as GroceryItemSpec } from "./GroceryItemSpec.js";
import GroceryCategory from "./GroceryCategory.js";
import { Data } from "./GroceryCategory.js";

const spec: NodeSpecWithCreate<GroceryCategory, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], GroceryCategory.name);
    if (existing) {
      return existing;
    }
    const result = new GroceryCategory(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "grocerycategory",
  },

  outboundEdges: {
    items: {
      type: "foreignKey",
      sourceField: "id",
      destField: "categoryId",
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
