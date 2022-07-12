// SIGNED-SOURCE: <5ffee1b026afe866ea8633c3cc330441>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./GroceryListSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryListQuery from "./GroceryListQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItemQuery from "./GroceryItemQuery.js";
import GroceryItem from "./GroceryItem.js";

export type Data = {
  id: SID_of<GroceryList>;
  name: string;
};

export default class GroceryList extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  queryItems(): GroceryItemQuery {
    return GroceryItemQuery.create(this.ctx).whereListId(P.equals(this.id));
  }

  static queryAll(ctx: Context): GroceryListQuery {
    return GroceryListQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<GroceryList>
  ): Promise<GroceryList> {
    const existing = ctx.cache.get(id, GroceryList.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceryList>
  ): Promise<GroceryList | null> {
    const existing = ctx.cache.get(id, GroceryList.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
