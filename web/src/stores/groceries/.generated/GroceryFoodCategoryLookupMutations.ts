// SIGNED-SOURCE: <d905422fa89cea63f7fccff48c8cd0d0>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "./GroceryFoodCategoryLookupMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import GroceryFoodCategoryLookup from "./GroceryFoodCategoryLookup.js";
import { default as spec } from "./GroceryFoodCategoryLookupSpec.js";
import { Data } from "./GroceryFoodCategoryLookup.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import GroceryCategory from "./GroceryCategory.js";

export type CreateArgs = {
  id: SID_of<GroceryFoodCategoryLookup>;
  categoryId: SID_of<GroceryCategory>;
};

export type SetCategoryArgs = { categoryId: SID_of<GroceryCategory> };
class Mutations extends MutationsBase<GroceryFoodCategoryLookup, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<GroceryFoodCategoryLookup, Data>
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setCategory(args: SetCategoryArgs): this {
    const extraChangesets = impls.setCategoryImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class GroceryFoodCategoryLookupMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
  static setCategory(
    model: GroceryFoodCategoryLookup,
    args: SetCategoryArgs
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(model.ctx, spec, model)
    ).setCategory(args);
  }
}
