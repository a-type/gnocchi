// SIGNED-SOURCE: <4fc44bcca6d8a7c8cb15eadd6191d537>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../GroceryItemMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import GroceryItem from "../GroceryItem.js";
import { default as spec } from "./GroceryItemSpec.js";
import { Data } from "./GroceryItemBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import GroceryList from "../GroceryList.js";
import GroceryCategory from "../GroceryCategory.js";

export type CreateArgs = {
  listId: SID_of<GroceryList>;
  categoryId: SID_of<GroceryCategory>;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  name: string;
  sortKey: string;
};

export type SetPurchasedQuantityArgs = { purchasedQuantity: number };

export type SetCategoryArgs = { categoryId: SID_of<GroceryCategory> };

export type SetTotalQuantityArgs = { totalQuantity: number };

export type SetSortKeyArgs = { sortKey: string };

export type DeleteArgs = {};
class Mutations extends MutationsBase<GroceryItem, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<GroceryItem, Data>,
    private model?: GroceryItem
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setPurchasedQuantity(args: SetPurchasedQuantityArgs): this {
    const extraChangesets = impls.setPurchasedQuantityImpl(
      this.model!,
      this.mutator,
      args
    );
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setCategory(args: SetCategoryArgs): this {
    const extraChangesets = impls.setCategoryImpl(
      this.model!,
      this.mutator,
      args
    );
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setTotalQuantity(args: SetTotalQuantityArgs): this {
    const extraChangesets = impls.setTotalQuantityImpl(
      this.model!,
      this.mutator,
      args
    );
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  setSortKey(args: SetSortKeyArgs): this {
    const extraChangesets = impls.setSortKeyImpl(
      this.model!,
      this.mutator,
      args
    );
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }

  delete(args: DeleteArgs): this {
    const extraChangesets = impls.deleteImpl(this.model!, this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

const staticMutations = {
  create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  },
};

export default staticMutations;

export class InstancedMutations {
  constructor(private model: GroceryItem) {}

  setPurchasedQuantity(args: SetPurchasedQuantityArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).setPurchasedQuantity(args);
  }

  setCategory(args: SetCategoryArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).setCategory(args);
  }

  setTotalQuantity(args: SetTotalQuantityArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).setTotalQuantity(args);
  }

  setSortKey(args: SetSortKeyArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new UpdateMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).setSortKey(args);
  }
  delete(args: DeleteArgs): Mutations {
    return new Mutations(
      this.model.ctx,
      new DeleteMutationBuilder(this.model.ctx, spec, this.model),
      this.model
    ).delete(args);
  }
}
