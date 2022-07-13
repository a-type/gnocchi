// SIGNED-SOURCE: <cfe071bde19ee05a5f2d2d2899cae451>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./GroceryListSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./GroceryListManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
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

class GroceryList extends Node<Data> {
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

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface GroceryList extends ManualMethods {}
applyMixins(GroceryList, [manualMethods]);
export default GroceryList;
