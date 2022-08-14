// SIGNED-SOURCE: <4a91d37e9ab06e8ec9b23f2add58439c>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import GroceryList from "../GroceryList.js";
import { default as s } from "./GroceryListSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryListQuery from "./GroceryListQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItemQuery from "./GroceryItemQuery.js";
import GroceryItem from "../GroceryItem.js";
import GroceryListMutations from "./GroceryListMutations.js";
import { InstancedMutations } from "./GroceryListMutations.js";

declare type Muts = typeof GroceryListMutations;
declare type IMuts = InstancedMutations;

export type Data = {
  id: SID_of<GroceryList>;
  name: string;
};

// @Sealed(GroceryList)
export default abstract class GroceryListBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return GroceryListMutations;
  }

  get mutations(): IMuts {
    return new InstancedMutations(this as any);
  }

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get name(): string {
    return this.data.name;
  }

  queryItems(): GroceryItemQuery {
    return GroceryItemQuery.create(this.ctx).whereListId(
      P.equals(this.id as any)
    );
  }

  static queryAll(ctx: Context): GroceryListQuery {
    return GroceryListQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "undefined",
    "grocerylist",
    (ctx: Context, id: SID_of<GroceryList>): Promise<GroceryList> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<GroceryList | null>(
    "undefined",
    "grocerylist",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<GroceryList>): Promise<GroceryList | null> =>
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
