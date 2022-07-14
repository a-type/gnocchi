// SIGNED-SOURCE: <b4ac2e7dfaea77567df7e5e3cb9631f8>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./GroceryItemSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./GroceryItemManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryItemQuery from "./GroceryItemQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryInputQuery from "./GroceryInputQuery.js";
import GroceryInput from "./GroceryInput.js";
import GroceryList from "./GroceryList.js";
import GroceryCategory from "./GroceryCategory.js";

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

class GroceryItem extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
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
    return GroceryInputQuery.create(this.ctx).whereItemId(P.equals(this.id));
  }

  static queryAll(ctx: Context): GroceryItemQuery {
    return GroceryItemQuery.create(ctx);
  }

  static async genx(
    ctx: Context,
    id: SID_of<GroceryItem>
  ): Promise<GroceryItem> {
    const existing = ctx.cache.get(id, GroceryItem.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceryItem>
  ): Promise<GroceryItem | null> {
    const existing = ctx.cache.get(id, GroceryItem.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genOnlyValue();
  }

  update(data: Partial<Data>) {
    return new UpdateMutationBuilder(this.ctx, this.spec, this)
      .set(data)
      .toChangeset();
  }

  static create(ctx: Context, data: Partial<Data>) {
    return new CreateMutationBuilder(ctx, s).set(data).toChangeset();
  }

  delete() {
    return new DeleteMutationBuilder(this.ctx, s, this).toChangeset();
  }
}

interface GroceryItem extends ManualMethods {}
applyMixins(GroceryItem, [manualMethods]);
export default GroceryItem;
