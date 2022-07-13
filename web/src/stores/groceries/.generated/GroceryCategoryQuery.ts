// SIGNED-SOURCE: <e0ee731943a8b8608e2d085d9e092566>
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
import GroceryCategory from "./GroceryCategory.js";
import { Data } from "./GroceryCategory.js";
import { default as spec } from "./GroceryCategorySpec.js";
import { default as GroceryItemSpec } from "./GroceryItemSpec.js";
import GroceryItemQuery from "./GroceryItemQuery.js";

export default class GroceryCategoryQuery extends DerivedQuery<GroceryCategory> {
  static create(ctx: Context) {
    return new GroceryCategoryQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GroceryCategoryQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GroceryCategoryQuery {
    return new GroceryCategoryQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<GroceryCategory>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, GroceryCategory>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"name", Data, GroceryCategory>("name"), p)
    );
  }
  queryItems(): GroceryItemQuery {
    return new GroceryItemQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.items),
      modelLoad(this.ctx, GroceryItemSpec.createFrom)
    );
  }

  take(n: number) {
    return new GroceryCategoryQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"id", Data, GroceryCategory>("id"),
        direction
      )
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"name", Data, GroceryCategory>("name"),
        direction
      )
    );
  }
}
