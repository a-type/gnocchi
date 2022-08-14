// SIGNED-SOURCE: <85f788151de689b897abb8f85ac9ae87>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../GroceryListMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import GroceryList from "../GroceryList.js";
import { default as spec } from "./GroceryListSpec.js";
import { Data } from "./GroceryListBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";

export type CreateArgs = { name: string };
class Mutations extends MutationsBase<GroceryList, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<GroceryList, Data>,
    private model?: GroceryList
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
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
  constructor(private model: GroceryList) {}
}
