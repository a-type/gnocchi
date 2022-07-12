// SIGNED-SOURCE: <ef1a762cf5ecce4e2b218b7645e188b9>
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
import GroceriesList from "./GroceriesList.js";
import { Data } from "./GroceriesList.js";
import { default as spec } from "./GroceriesListSpec.js";

export default class GroceriesListQuery extends DerivedQuery<GroceriesList> {
  static create(ctx: Context) {
    return new GroceriesListQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new GroceriesListQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): GroceriesListQuery {
    return new GroceriesListQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<GroceriesList>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"id", Data, GroceriesList>("id"), p)
    );
  }

  whereName(p: Predicate<Data["name"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"name", Data, GroceriesList>("name"), p)
    );
  }

  take(n: number) {
    return new GroceriesListQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, GroceriesList>("id"), direction)
    );
  }

  orderByName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"name", Data, GroceriesList>("name"),
        direction
      )
    );
  }
}
