// SIGNED-SOURCE: <b85fecda69ea9b277c913f709ae8c387>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./GroceryCategorySpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryCategoryQuery from "./GroceryCategoryQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItemQuery from "./GroceryItemQuery.js";
import GroceryItem from "./GroceryItem.js";

export type Data = {
  id: SID_of<GroceryCategory>;
  name: string;
};

export default class GroceryCategory extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  queryItems(): GroceryItemQuery {
    return GroceryItemQuery.create(this.ctx).whereCategoryId(P.equals(this.id));
  }

  static queryAll(ctx: Context): GroceryCategoryQuery {
    return GroceryCategoryQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<GroceryCategory>
  ): Promise<GroceryCategory> {
    const existing = ctx.cache.get(id, GroceryCategory.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceryCategory>
  ): Promise<GroceryCategory | null> {
    const existing = ctx.cache.get(id, GroceryCategory.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
