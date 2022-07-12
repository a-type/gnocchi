// SIGNED-SOURCE: <6d6843d406fa942e1a474c2110ab5c02>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import { default as s } from "./GroceriesListSpec.js";
import { P } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceriesListQuery from "./GroceriesListQuery.js";
import { Context } from "@aphro/runtime-ts";

export type Data = {
  id: SID_of<GroceriesList>;
  name: string;
};

export default class GroceriesList extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  static queryAll(ctx: Context): GroceriesListQuery {
    return GroceriesListQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<GroceriesList>
  ): Promise<GroceriesList> {
    const existing = ctx.cache.get(id, GroceriesList.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceriesList>
  ): Promise<GroceriesList | null> {
    const existing = ctx.cache.get(id, GroceriesList.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }
}
