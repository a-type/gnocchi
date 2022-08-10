// SIGNED-SOURCE: <b835eb4d0e7ff4ade642fcb2ae409b25>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { decodeModelData } from "@aphro/runtime-ts";
import { encodeModelData } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import GroceryInput from "../GroceryInput.js";
import { Data } from "./GroceryInputBase.js";

const fields = {
  id: {
    encoding: "none",
  },
  itemId: {
    encoding: "none",
  },
  text: {
    encoding: "none",
  },
} as const;
const GroceryInputSpec: NodeSpecWithCreate<GroceryInput, Data> = {
  type: "node",
  createFrom(ctx: Context, data: Data, raw: boolean = true) {
    const existing = ctx.cache.get(data["id"], "undefined", "groceryinput");
    if (existing) {
      return existing;
    }
    if (raw) data = decodeModelData(data, fields);
    const result = new GroceryInput(ctx, data);
    ctx.cache.set(data["id"], result, "undefined", "groceryinput");
    return result;
  },

  primaryKey: "id",

  storage: {
    engine: "sqlite",
    db: "undefined",
    type: "sql",
    tablish: "groceryinput",
  },

  fields,

  outboundEdges: {},
};

export default GroceryInputSpec;
