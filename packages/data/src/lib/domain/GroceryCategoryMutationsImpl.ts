import { CreateArgs } from "./generated/GroceryCategoryMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./GroceryCategory.js";
import GroceryCategory from "./GroceryCategory.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<GroceryCategory, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({ id: sid("AAAA"), name });
}
