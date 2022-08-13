// SIGNED-SOURCE: <9a02b5d0005eec607b19a1ca9d6b66c5>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import GroceryFoodCategoryLookup from "../GroceryFoodCategoryLookup.js";
import { default as s } from "./GroceryFoodCategoryLookupSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryFoodCategoryLookupQuery from "./GroceryFoodCategoryLookupQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryCategory from "../GroceryCategory.js";

export type Data = {
  id: SID_of<GroceryFoodCategoryLookup>;
  categoryId: SID_of<GroceryCategory>;
};

// @Sealed(GroceryFoodCategoryLookup)
export default abstract class GroceryFoodCategoryLookupBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get categoryId(): SID_of<GroceryCategory> {
    return this.data.categoryId;
  }

  static queryAll(ctx: Context): GroceryFoodCategoryLookupQuery {
    return GroceryFoodCategoryLookupQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "undefined",
    "groceryfoodcategorylookup",
    (
      ctx: Context,
      id: SID_of<GroceryFoodCategoryLookup>
    ): Promise<GroceryFoodCategoryLookup> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<GroceryFoodCategoryLookup | null>(
    "undefined",
    "groceryfoodcategorylookup",
    // @ts-ignore #43
    (
      ctx: Context,
      id: SID_of<GroceryFoodCategoryLookup>
    ): Promise<GroceryFoodCategoryLookup | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return makeSavable(
      this.ctx,
      new UpdateMutationBuilder(this.ctx, this.spec, this)
        .set(data)
        .toChangesets()[0]
    );
  }

  static create(ctx: Context, data: Partial<Data>) {
    return makeSavable(
      ctx,
      new CreateMutationBuilder(ctx, s).set(data).toChangesets()[0]
    );
  }

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
