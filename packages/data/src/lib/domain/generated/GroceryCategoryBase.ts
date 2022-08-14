// SIGNED-SOURCE: <8b2bd5de6247ef1bc5068b31578eb6fc>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import GroceryCategory from "../GroceryCategory.js";
import { default as s } from "./GroceryCategorySpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryCategoryQuery from "./GroceryCategoryQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItemQuery from "./GroceryItemQuery.js";
import GroceryItem from "../GroceryItem.js";
import GroceryCategoryMutations from "./GroceryCategoryMutations.js";
import { InstancedMutations } from "./GroceryCategoryMutations.js";

declare type Muts = typeof GroceryCategoryMutations;
declare type IMuts = InstancedMutations;

export type Data = {
  id: SID_of<GroceryCategory>;
  name: string;
};

// @Sealed(GroceryCategory)
export default abstract class GroceryCategoryBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  static get mutations(): Muts {
    return GroceryCategoryMutations;
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
    return GroceryItemQuery.create(this.ctx).whereCategoryId(
      P.equals(this.id as any)
    );
  }

  static queryAll(ctx: Context): GroceryCategoryQuery {
    return GroceryCategoryQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "undefined",
    "grocerycategory",
    (ctx: Context, id: SID_of<GroceryCategory>): Promise<GroceryCategory> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<GroceryCategory | null>(
    "undefined",
    "grocerycategory",
    // @ts-ignore #43
    (
      ctx: Context,
      id: SID_of<GroceryCategory>
    ): Promise<GroceryCategory | null> =>
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
