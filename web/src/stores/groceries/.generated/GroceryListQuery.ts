// SIGNED-SOURCE: <3afd1f11cac6a4d80e09760946bad8e7>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
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
import GroceryList from "./GroceryList.js";
import { Data } from "./GroceryList.js";
import { default as spec } from "./GroceryListSpec.js";
import { default as GroceryItemSpec } from "./GroceryItemSpec.js";
import GroceryItemQuery from "./GroceryItemQuery.js";

export default class GroceryListQuery extends DerivedQuery<GroceryList> {
  static create(ctx: Context) {
    return new GroceryListQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GroceryListQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GroceryListQuery {
    return new GroceryListQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<GroceryList>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, GroceryList>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"name", Data, GroceryList>("name"), p)
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
    return new GroceryListQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, GroceryList>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"name", Data, GroceryList>("name"),
        direction
      )
    );
  }
}
