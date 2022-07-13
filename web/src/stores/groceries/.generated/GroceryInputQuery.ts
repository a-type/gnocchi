// SIGNED-SOURCE: <7956cb5530ed6f7a816cf6c6470b0aa9>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import GroceryInput from "./GroceryInput.js";
import { Data } from "./GroceryInput.js";
import { default as spec } from "./GroceryInputSpec.js";
import GroceryItem from "./GroceryItem.js";

export default class GroceryInputQuery extends DerivedQuery<GroceryInput> {
  static create(ctx: Context) {
    return new GroceryInputQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GroceryInputQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GroceryInputQuery {
    return new GroceryInputQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<GroceryInput>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, GroceryInput>("id"), p)
    );
  }

  whereItemId(p: Predicate<Data["itemId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"itemId", Data, GroceryInput>("itemId"), p)
    );
  }

  whereText(p: Predicate<Data["text"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"text", Data, GroceryInput>("text"), p)
    );
  }

  take(n: number) {
    return new GroceryInputQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, GroceryInput>("id"), direction)
    );
  }

  orderByItemId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"itemId", Data, GroceryInput>("itemId"),
        direction
      )
    );
  }

  orderByText(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"text", Data, GroceryInput>("text"),
        direction
      )
    );
  }
}
