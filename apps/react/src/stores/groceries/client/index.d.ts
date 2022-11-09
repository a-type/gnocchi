import type { StorageSchema } from "@lo-fi/common";
import type {
  Storage,
  StorageInitOptions,
  ObjectEntity,
  ListEntity,
  Query,
} from "@lo-fi/web";
export * from "@lo-fi/web";

import type schema from "./schema.js";
export type Schema = typeof schema;
export interface CategorySnapshot {
  id: string;
  name: string;
  sortKey: string;
}

export interface CategoryInit {
  id?: string;
  name: string;
  sortKey?: string;
}
export type Category = ObjectEntity<CategoryInit>;

export interface CategoryIdMatchFilter {
  where: "id";
  equals: string;
  order?: "asc" | "desc";
}

export interface CategoryIdRangeFilter {
  where: "id";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface CategorySortKeyMatchFilter {
  where: "sortKey";
  equals: string;
  order?: "asc" | "desc";
}

export interface CategorySortKeyRangeFilter {
  where: "sortKey";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export type CategoryFilter =
  | CategoryIdMatchFilter
  | CategoryIdRangeFilter
  | CategorySortKeyMatchFilter
  | CategorySortKeyRangeFilter;

export interface ItemSnapshot {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs: Array<{
    text: string;
    url: string | null;
    title: string | null;
  }>;
}

export interface ItemInit {
  id?: string;
  categoryId?: string | null;
  createdAt?: number;
  totalQuantity: number;
  purchasedQuantity?: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs?: Array<{
    text: string;
    url?: string | null;
    title?: string | null;
  }>;
}
export type Item = ObjectEntity<ItemInit>;

export type ItemInputs = ListEntity<{
  text: string;
  url: string | null;
  title: string | null;
}>;

export type ItemInputsItem = ObjectEntity<{
  text: string;
  url: string | null;
  title: string | null;
}>;

export interface ItemIdMatchFilter {
  where: "id";
  equals: string;
  order?: "asc" | "desc";
}

export interface ItemIdRangeFilter {
  where: "id";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface ItemCategoryIdMatchFilter {
  where: "categoryId";
  equals: string | null;
  order?: "asc" | "desc";
}

export interface ItemCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string | null;
  gt?: string | null;
  lte?: string | null;
  lt?: string | null;
  order?: "asc" | "desc";
}

export interface ItemFoodMatchFilter {
  where: "food";
  equals: string;
  order?: "asc" | "desc";
}

export interface ItemFoodRangeFilter {
  where: "food";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface ItemCategoryIdSortKeyCompoundFilter {
  where: "categoryId_sortKey";
  match: {
    categoryId?: string | null;
    sortKey?: string;
  };
  order: "asc" | "desc";
}

export interface ItemPurchasedMatchFilter {
  where: "purchased";
  equals: string;
  order?: "asc" | "desc";
}

export interface ItemPurchasedRangeFilter {
  where: "purchased";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export type ItemFilter =
  | ItemIdMatchFilter
  | ItemIdRangeFilter
  | ItemCategoryIdMatchFilter
  | ItemCategoryIdRangeFilter
  | ItemFoodMatchFilter
  | ItemFoodRangeFilter
  | ItemCategoryIdSortKeyCompoundFilter
  | ItemPurchasedMatchFilter
  | ItemPurchasedRangeFilter;

export interface FoodCategoryAssignmentSnapshot {
  id: string;
  foodName: string;
  categoryId: string;
  remote: boolean;
}

export interface FoodCategoryAssignmentInit {
  id?: string;
  foodName: string;
  categoryId: string;
  remote: boolean;
}
export type FoodCategoryAssignment = ObjectEntity<FoodCategoryAssignmentInit>;

export interface FoodCategoryAssignmentIdMatchFilter {
  where: "id";
  equals: string;
  order?: "asc" | "desc";
}

export interface FoodCategoryAssignmentIdRangeFilter {
  where: "id";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface FoodCategoryAssignmentFoodNameMatchFilter {
  where: "foodName";
  equals: string;
  order?: "asc" | "desc";
}

export interface FoodCategoryAssignmentFoodNameRangeFilter {
  where: "foodName";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface FoodCategoryAssignmentCategoryIdMatchFilter {
  where: "categoryId";
  equals: string;
  order?: "asc" | "desc";
}

export interface FoodCategoryAssignmentCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export type FoodCategoryAssignmentFilter =
  | FoodCategoryAssignmentIdMatchFilter
  | FoodCategoryAssignmentIdRangeFilter
  | FoodCategoryAssignmentFoodNameMatchFilter
  | FoodCategoryAssignmentFoodNameRangeFilter
  | FoodCategoryAssignmentCategoryIdMatchFilter
  | FoodCategoryAssignmentCategoryIdRangeFilter;

interface Collection<
  Document extends ObjectEntity<any>,
  Snapshot,
  Init,
  Filter
> {
  create: (init: Init) => Promise<Document>;
  upsert: (init: Init) => Promise<Document>;
  delete: (id: string) => Promise<void>;
  deleteAll: (ids: string[]) => Promise<void>;
  get: (id: string) => Query<Document>;
  findOne: (filter: Filter) => Query<Document>;
  findAll: (filter?: Filter) => Query<Document[]>;
}

export class Client {
  readonly categories: Collection<
    Category,
    CategorySnapshot,
    CategoryInit,
    CategoryFilter
  >;

  readonly items: Collection<Item, ItemSnapshot, ItemInit, ItemFilter>;

  readonly foodCategoryAssignments: Collection<
    FoodCategoryAssignment,
    FoodCategoryAssignmentSnapshot,
    FoodCategoryAssignmentInit,
    FoodCategoryAssignmentFilter
  >;

  presence: Storage["sync"]["presence"];
  sync: Storage["sync"];
  undoHistory: Storage["undoHistory"];
  namespace: Storage["namespace"];

  close: Storage["close"];

  stats: () => Promise<any>;
}

export class ClientDescriptor {
  constructor(init: Omit<StorageInitOptions<Schema>, "schema">);
  open: () => Promise<Client>;
  readonly current: Client | null;
  readonly readyPromise: Promise<Client>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  close: () => Promise<void>;
}
