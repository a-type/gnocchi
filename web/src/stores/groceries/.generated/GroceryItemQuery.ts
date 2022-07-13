// SIGNED-SOURCE: <a4d580efd6e4a7ef4fce9f9428f14160>
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
import GroceryItem from "./GroceryItem.js";
import { Data } from "./GroceryItem.js";
import { default as spec } from "./GroceryItemSpec.js";
import GroceryList from "./GroceryList.js";
import GroceryCategory from "./GroceryCategory.js";
import { default as GroceryInputSpec } from "./GroceryInputSpec.js";
import GroceryInputQuery from "./GroceryInputQuery.js";

export default class GroceryItemQuery extends DerivedQuery<GroceryItem> {
  static create(ctx: Context) {
    return new GroceryItemQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GroceryItemQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GroceryItemQuery {
    return new GroceryItemQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<GroceryItem>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, GroceryItem>("id"), p)
    );
  }

  whereListId(p: Predicate<Data["listId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"listId", Data, GroceryItem>("listId"), p)
    );
  }

  whereCategoryId(p: Predicate<Data["categoryId"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"categoryId", Data, GroceryItem>("categoryId"),
        p
      )
    );
  }

  whereCreatedAt(p: Predicate<Data["createdAt"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"createdAt", Data, GroceryItem>("createdAt"),
        p
      )
    );
  }

  whereTotalQuantity(p: Predicate<Data["totalQuantity"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"totalQuantity", Data, GroceryItem>(
          "totalQuantity"
        ),
        p
      )
    );
  }

  wherePurchasedQuantity(p: Predicate<Data["purchasedQuantity"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"purchasedQuantity", Data, GroceryItem>(
          "purchasedQuantity"
        ),
        p
      )
    );
  }

  whereUnit(p: Predicate<Data["unit"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"unit", Data, GroceryItem>("unit"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"name", Data, GroceryItem>("name"), p)
    );
  }
  queryInputs(): GroceryInputQuery {
    return new GroceryInputQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.inputs),
      modelLoad(this.ctx, GroceryInputSpec.createFrom)
    );
  }

  take(n: number) {
    return new GroceryItemQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, GroceryItem>("id"), direction)
    );
  }

  orderByListId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"listId", Data, GroceryItem>("listId"),
        direction
      )
    );
  }

  orderByCategoryId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"categoryId", Data, GroceryItem>("categoryId"),
        direction
      )
    );
  }

  orderByCreatedAt(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"createdAt", Data, GroceryItem>("createdAt"),
        direction
      )
    );
  }

  orderByTotalQuantity(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"totalQuantity", Data, GroceryItem>(
          "totalQuantity"
        ),
        direction
      )
    );
  }

  orderByPurchasedQuantity(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"purchasedQuantity", Data, GroceryItem>(
          "purchasedQuantity"
        ),
        direction
      )
    );
  }

  orderByUnit(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"unit", Data, GroceryItem>("unit"),
        direction
      )
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"name", Data, GroceryItem>("name"),
        direction
      )
    );
  }
}
