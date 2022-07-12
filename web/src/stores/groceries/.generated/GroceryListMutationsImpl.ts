import { CreateArgs } from "./GroceryListMutations.js";
import { Changeset, sid } from "@aphro/runtime-ts";
import { Data } from "./GroceryList.js";
import GroceryList from "./GroceryList.js";
import { IMutationBuilder } from "@aphro/runtime-ts";

export function createImpl(
  mutator: Omit<IMutationBuilder<GroceryList, Data>, "toChangeset">,
  { name }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({ name, id: sid("AAAA") });
}
