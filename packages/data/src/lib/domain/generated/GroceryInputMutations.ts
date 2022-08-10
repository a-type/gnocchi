// SIGNED-SOURCE: <314d2d3c7b78e8541d62646dbf4664d3>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import * as impls from "../GroceryInputMutationsImpl.js";
import { ICreateOrUpdateBuilder } from "@aphro/runtime-ts";
import { Context } from "@aphro/runtime-ts";
import { MutationsBase } from "@aphro/runtime-ts";
import GroceryInput from "../GroceryInput.js";
import { default as spec } from "./GroceryInputSpec.js";
import { Data } from "./GroceryInputBase.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import { Changeset } from "@aphro/runtime-ts";
import GroceryItem from "../GroceryItem.js";

export type CreateArgs = { itemId: SID_of<GroceryItem>; text: string };
class Mutations extends MutationsBase<GroceryInput, Data> {
  constructor(
    ctx: Context,
    mutator: ICreateOrUpdateBuilder<GroceryInput, Data>
  ) {
    super(ctx, mutator);
  }

  create(args: CreateArgs): this {
    const extraChangesets = impls.createImpl(this.mutator, args);
    this.mutator.addExtraChangesets(extraChangesets || undefined);
    return this;
  }
}

export default class GroceryInputMutations {
  static create(ctx: Context, args: CreateArgs): Mutations {
    return new Mutations(ctx, new CreateMutationBuilder(ctx, spec)).create(
      args
    );
  }
}
