// SIGNED-SOURCE: <493541bc5d932850c8d0b4c86da62c88>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
 */
import * as impls from "./GroceryItemMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import GroceryItem from "./GroceryItem.js";
import { default as spec } from "./GroceryItemSpec.js";
import { Data } from "./GroceryItem.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import GroceryList from "./GroceryList.js";
import GroceryCategory from "./GroceryCategory.js";

export type CreateArgs = {
  listId: SID_of<GroceryList>;
  categoryId: SID_of<GroceryCategory>;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  name: string;
};

export type SetPurchasedQuantityArgs = { purchasedQuantity: number };

export type SetCategoryArgs = { categoryId: SID_of<GroceryCategory> };

export type SetTotalQuantityArgs = { totalQuantity: number };

export type DeleteArgs = {};
class Mutations extends MutationsBase<GroceryItem, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<GroceryItem, Data>
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setPurchasedQuantity(args: SetPurchasedQuantityArgs): this {
    const extraChangesets = impls.setPurchasedQuantityImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setCategory(args: SetCategoryArgs): this {
    const extraChangesets = impls.setCategoryImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setTotalQuantity(args: SetTotalQuantityArgs): this {
    const extraChangesets = impls.setTotalQuantityImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class GroceryItemMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(spec)).create(args);
  }
  static setPurchasedQuantity(
    model: GroceryItem,
    args: SetPurchasedQuantityArgs
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).setPurchasedQuantity(args);
  }

  static setCategory(model: GroceryItem, args: SetCategoryArgs): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).setCategory(args);
  }

  static setTotalQuantity(
    model: GroceryItem,
    args: SetTotalQuantityArgs
  ): Mutations {
    return new Mutations(
      model.ctx,
      new UpdateMutationBuilder(spec, model)
    ).setTotalQuantity(args);
  }
  static delete(model: GroceryItem, args: DeleteArgs): Mutations {
    return new Mutations(
      model.ctx,
      new DeleteMutationBuilder(spec, model)
    ).delete(args);
  }
}
