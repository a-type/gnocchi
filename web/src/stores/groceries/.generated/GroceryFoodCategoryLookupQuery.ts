// SIGNED-SOURCE: <a9f45970f1ee175acadd7ad66c46417a>
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
import GroceryFoodCategoryLookup from "./GroceryFoodCategoryLookup.js";
import { Data } from "./GroceryFoodCategoryLookup.js";
import { default as spec } from "./GroceryFoodCategoryLookupSpec.js";
import GroceryCategory from "./GroceryCategory.js";

export default class GroceryFoodCategoryLookupQuery extends DerivedQuery<GroceryFoodCategoryLookup> {
  static create(ctx: Context) {
    return new GroceryFoodCategoryLookupQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GroceryFoodCategoryLookupQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GroceryFoodCategoryLookupQuery {
    return new GroceryFoodCategoryLookupQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<GroceryFoodCategoryLookup>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"id", Data, GroceryFoodCategoryLookup>("id"),
        p
      )
    );
  }

  whereCategoryId(p: Predicate<Data["categoryId"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"categoryId", Data, GroceryFoodCategoryLookup>(
          "categoryId"
        ),
        p
      )
    );
  }

  take(n: number) {
    return new GroceryFoodCategoryLookupQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"id", Data, GroceryFoodCategoryLookup>("id"),
        direction
      )
    );
  }

  orderByCategoryId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"categoryId", Data, GroceryFoodCategoryLookup>(
          "categoryId"
        ),
        direction
      )
    );
  }
}
