// SIGNED-SOURCE: <2bc80cecebf40965169a6e0b00848681>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { Context } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import GroceriesList from "./GroceriesList.js";
import { Data } from "./GroceriesList.js";

const spec: NodeSpecWithCreate<GroceriesList, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data) {
    const existing = ctx.cache.get(data["id"], GroceriesList.name);
    if (existing) {
      return existing;
    }
    const result = new GroceriesList(ctx, data);
    ctx.cache.set(data["id"], result);
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "grocerieslist",
  },

  outboundEdges: {},
};

export default spec;
