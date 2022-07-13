// SIGNED-SOURCE: <6f56ec158fcae6fb6a5f403283087e4c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./GroceryFoodCategoryLookupSpec.js";
import { P } from "@aphro/runtime-ts";
import {
  ManualMethods,
  manualMethods,
} from "./GroceryFoodCategoryLookupManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryFoodCategoryLookupQuery from "./GroceryFoodCategoryLookupQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryCategory from "./GroceryCategory.js";

export type Data = {
  id: SID_of<GroceryFoodCategoryLookup>;
  categoryId: SID_of<GroceryCategory>;
};

class GroceryFoodCategoryLookup extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get categoryId(): SID_of<GroceryCategory> {
    return this.data.categoryId;
  }

  static queryAll(ctx: Context): GroceryFoodCategoryLookupQuery {
    return GroceryFoodCategoryLookupQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<GroceryFoodCategoryLookup>
  ): Promise<GroceryFoodCategoryLookup> {
    const existing = ctx.cache.get(id, GroceryFoodCategoryLookup.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceryFoodCategoryLookup>
  ): Promise<GroceryFoodCategoryLookup | null> {
    const existing = ctx.cache.get(id, GroceryFoodCategoryLookup.name);
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

interface GroceryFoodCategoryLookup extends ManualMethods {}
applyMixins(GroceryFoodCategoryLookup, [manualMethods]);
export default GroceryFoodCategoryLookup;
