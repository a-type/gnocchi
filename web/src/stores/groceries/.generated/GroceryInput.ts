// SIGNED-SOURCE: <9cee27dca5684b7ba714ab0e60a385b4>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./GroceryInputSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryInputQuery from "./GroceryInputQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItem from "./GroceryItem.js";

export type Data = {
  id: SID_of<GroceryInput>;
  itemId: SID_of<GroceryItem>;
  text: string;
};

export default class GroceryInput extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get itemId(): SID_of<GroceryItem> {
    return this.data.itemId;
  }

  get text(): string {
    return this.data.text;
  }

  static queryAll(ctx: Context): GroceryInputQuery {
    return GroceryInputQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<GroceryInput>
  ): Promise<GroceryInput> {
    const existing = ctx.cache.get(id, GroceryInput.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceryInput>
  ): Promise<GroceryInput | null> {
    const existing = ctx.cache.get(id, GroceryInput.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
