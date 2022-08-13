// SIGNED-SOURCE: <7300d1be01b3db160edbed64bf20d15e>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import GroceryItem from "../GroceryItem.js";
import { default as s } from "./GroceryItemSpec.js";
import { P } from "@aphro/runtime-ts";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { makeSavable } from "@aphro/runtime-ts";
import { modelGenMemo } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryItemQuery from "./GroceryItemQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryInputQuery from "./GroceryInputQuery.js";
import GroceryInput from "../GroceryInput.js";
import GroceryList from "../GroceryList.js";
import GroceryCategory from "../GroceryCategory.js";

export type Data = {
  id: SID_of<GroceryItem>;
  listId: SID_of<GroceryList>;
  categoryId: SID_of<GroceryCategory>;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  name: string;
  sortKey: string;
};

// @Sealed(GroceryItem)
export default abstract class GroceryItemBase extends Node<Data> {
  readonly spec = s as unknown as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as unknown as SID_of<this>;
  }

  get listId(): SID_of<GroceryList> {
    return this.data.listId;
  }

  get categoryId(): SID_of<GroceryCategory> {
    return this.data.categoryId;
  }

  get createdAt(): number {
    return this.data.createdAt;
  }

  get totalQuantity(): number {
    return this.data.totalQuantity;
  }

  get purchasedQuantity(): number {
    return this.data.purchasedQuantity;
  }

  get unit(): string {
    return this.data.unit;
  }

  get name(): string {
    return this.data.name;
  }

  get sortKey(): string {
    return this.data.sortKey;
  }

  queryInputs(): GroceryInputQuery {
    return GroceryInputQuery.create(this.ctx).whereItemId(
      P.equals(this.id as any)
    );
  }

  static queryAll(ctx: Context): GroceryItemQuery {
    return GroceryItemQuery.create(ctx);
  }

  static genx = modelGenMemo(
    "undefined",
    "groceryitem",
    (ctx: Context, id: SID_of<GroceryItem>): Promise<GroceryItem> =>
      this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue()
  );

  static gen = modelGenMemo<GroceryItem | null>(
    "undefined",
    "groceryitem",
    // @ts-ignore #43
    (ctx: Context, id: SID_of<GroceryItem>): Promise<GroceryItem | null> =>
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
