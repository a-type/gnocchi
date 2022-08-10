// SIGNED-SOURCE: <ac697c0542f486ac836e932cec7d94bd>
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

  static gen = modelGenMemo(
    "undefined",
    "groceryfoodcategorylookup",
    (
      ctx: Context,
      id: SID_of<GroceryFoodCategoryLookup>
    ): Promise<GroceryFoodCategoryLookup | null> =>
      this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue()
  );

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, this.spec, this).toChangeset();
  }
}
