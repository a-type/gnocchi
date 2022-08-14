// SIGNED-SOURCE: <8321f6fc56ac136d5f37eae2a393acea>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import GroceryInput from "../GroceryInput.js";
import { default as s } from "./GroceryInputSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryInputQuery from "./GroceryInputQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItem from "../GroceryItem.js";
import GroceryInputMutations from "./GroceryInputMutations.js";
import { InstancedMutations } from "./GroceryInputMutations.js";

declare type Muts = typeof GroceryInputMutations;
declare type IMuts = InstancedMutations;

export type Data = {
  id: SID_of<GroceryInput>;
  itemId: SID_of<GroceryItem>;
  text: string;
};

// @Sealed(GroceryInput)
export default abstract class GroceryInputBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return GroceryInputMutations;
  }

  get mutations(): IMuts {
    return new InstancedMutations(this as any);
  }

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get itemId(): SID_of<GroceryItem> {
    return this.data.itemId;
  }

  get text(): string {
    return this.data.text;
  }

  static queryAll(ctx: Context): GroceryInputQuery {
    return GroceryInputQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "undefined",
    "groceryinput",
    (ctx: Context, id: SID_of<GroceryInput>): Promise<GroceryInput> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<GroceryInput | null>(
    "undefined",
    "groceryinput",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<GroceryInput>): Promise<GroceryInput | null> =>
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

  delete() {
    return makeSavable(
      this.ctx,
      new DeleteMutationBuilder(this.ctx, this.spec, this).toChangesets()[0]
    );
  }
}
