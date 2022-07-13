// SIGNED-SOURCE: <5e30d5cfe307208483527d343666c960>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { applyMixins } from "@aphro/runtime-ts";
import { default as s } from "./GroceryInputSpec.js";
import { P } from "@aphro/runtime-ts";
import { ManualMethods, manualMethods } from "./GroceryInputManualMethods.js";
import { UpdateMutationBuilder } from "@aphro/runtime-ts";
import { CreateMutationBuilder } from "@aphro/runtime-ts";
import { DeleteMutationBuilder } from "@aphro/runtime-ts";
import { Node } from "@aphro/runtime-ts";
import { NodeSpecWithCreate } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryInputQuery from "./GroceryInputQuery.js";
import { Context } from "@aphro/runtime-ts";
import GroceryItem from "./GroceryItem.js";

export type Data = {
  id: SID_of<GroceryInput>;
  itemId: SID_of<GroceryItem>;
  text: string;
};

class GroceryInput extends Node<Data> {
  readonly spec = s as NodeSpecWithCreate<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
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

  static async genx(
    ctx: Context,
    id: SID_of<GroceryInput>
  ): Promise<GroceryInput> {
    const existing = ctx.cache.get(id, GroceryInput.name);
    if (existing) {
      return existing;
    }
    return await this.queryAll(ctx).whereId(P.equals(id)).genxOnlyValue();
  }

  static async gen(
    ctx: Context,
    id: SID_of<GroceryInput>
  ): Promise<GroceryInput | null> {
    const existing = ctx.cache.get(id, GroceryInput.name);
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

interface GroceryInput extends ManualMethods {}
applyMixins(GroceryInput, [manualMethods]);
export default GroceryInput;
