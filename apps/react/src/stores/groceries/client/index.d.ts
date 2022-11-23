import type { StorageSchema } from "@lo-fi/common";
import type {
  Storage,
  StorageInitOptions,
  ObjectEntity,
  ListEntity,
  Query,
  ServerSync,
} from "@lo-fi/web";
export * from "@lo-fi/web";

import type schema from "./schema.js";
export type Schema = typeof schema;
export interface CategorySnapshot {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: {
    claimedBy: string;
    claimedAt: number;
  } | null;
}

export interface CategoryInit {
  id?: string;
  name: string;
  sortKey?: string;
  expirationDays?: number | null;
  claim?: {
    claimedBy: string;
    claimedAt: number;
  } | null;
}
export type Category = ObjectEntity<CategoryInit>;

export type CategoryClaim = ObjectEntity<{
  claimedBy: string;
  claimedAt: number;
} | null>;

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

export interface CategorySortKeyStartsWithFilter {
  where: "sortKey";
  startsWith: string;
  order?: "asc" | "desc";
}
export type CategoryFilter =
  | CategorySortKeyMatchFilter
  | CategorySortKeyRangeFilter
  | CategorySortKeyStartsWithFilter;

export interface ItemSnapshot {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs: Array<{
    text: string;
    url: string | null;
    title: string | null;
    quantity: number | null;
  }>;
  purchasedAt: number | null;
  expiredAt: number | null;
}

export interface ItemInit {
  id?: string;
  categoryId?: string | null;
  createdAt?: number;
  totalQuantity: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs?: Array<{
    text: string;
    url?: string | null;
    title?: string | null;
    quantity?: number | null;
  }>;
  purchasedAt?: number | null;
  expiredAt?: number | null;
}
export type Item = ObjectEntity<ItemInit>;

export type ItemInputs = ListEntity<{
  text: string;
  url: string | null;
  title: string | null;
  quantity: number | null;
}>;

export type ItemInputsItem = ObjectEntity<{
  text: string;
  url: string | null;
  title: string | null;
  quantity: number | null;
}>;

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

export interface ItemCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
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

export interface ItemFoodStartsWithFilter {
  where: "food";
  startsWith: string;
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

export interface ItemPurchasedFoodCompoundFilter {
  where: "purchased_food";
  match: {
    purchased?: string;
    food?: string;
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

export interface ItemPurchasedStartsWithFilter {
  where: "purchased";
  startsWith: string;
  order?: "asc" | "desc";
}
export type ItemFilter =
  | ItemCategoryIdMatchFilter
  | ItemCategoryIdRangeFilter
  | ItemCategoryIdStartsWithFilter
  | ItemFoodMatchFilter
  | ItemFoodRangeFilter
  | ItemFoodStartsWithFilter
  | ItemCategoryIdSortKeyCompoundFilter
  | ItemPurchasedFoodCompoundFilter
  | ItemPurchasedMatchFilter
  | ItemPurchasedRangeFilter
  | ItemPurchasedStartsWithFilter;

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

export interface FoodCategoryAssignmentFoodNameStartsWithFilter {
  where: "foodName";
  startsWith: string;
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

export interface FoodCategoryAssignmentCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
  order?: "asc" | "desc";
}
export type FoodCategoryAssignmentFilter =
  | FoodCategoryAssignmentFoodNameMatchFilter
  | FoodCategoryAssignmentFoodNameRangeFilter
  | FoodCategoryAssignmentFoodNameStartsWithFilter
  | FoodCategoryAssignmentCategoryIdMatchFilter
  | FoodCategoryAssignmentCategoryIdRangeFilter
  | FoodCategoryAssignmentCategoryIdStartsWithFilter;

export interface SuggestionSnapshot {
  text: string;
  usageCount: number;
}

export interface SuggestionInit {
  text: string;
  usageCount?: number;
}
export type Suggestion = ObjectEntity<SuggestionInit>;

export interface SuggestionUsageCountMatchFilter {
  where: "usageCount";
  equals: number;
  order?: "asc" | "desc";
}

export interface SuggestionUsageCountRangeFilter {
  where: "usageCount";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}

export type SuggestionFilter =
  | SuggestionUsageCountMatchFilter
  | SuggestionUsageCountRangeFilter;

interface Collection<
  Document extends ObjectEntity<any>,
  Snapshot,
  Init,
  Filter
> {
  /**
   * @deprecated use put
   */
  create: (init: Init) => Promise<Document>;
  put: (init: Init) => Promise<Document>;
  delete: (id: string) => Promise<void>;
  deleteAll: (ids: string[]) => Promise<void>;
  get: (id: string) => Query<Document>;
  findOne: (filter: Filter) => Query<Document>;
  findAll: (filter?: Filter) => Query<Document[]>;
}

export class Client<Presence = any, Profile = any> {
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

  readonly suggestions: Collection<
    Suggestion,
    SuggestionSnapshot,
    SuggestionInit,
    SuggestionFilter
  >;

  sync: ServerSync<Profile, Presence>;
  undoHistory: Storage["undoHistory"];
  namespace: Storage["namespace"];
  entities: Storage["entities"];
  queryStore: Storage["queryStore"];

  close: Storage["close"];

  stats: () => Promise<any>;
}

// schema is provided internally. loadInitialData must be revised to pass the typed Client
interface ClientInitOptions<Presence = any, Profile = any>
  extends Omit<
    StorageInitOptions<Presence, Profile>,
    "schema" | "loadInitialData"
  > {
  loadInitialData?: (client: Client) => Promise<void>;
}

export class ClientDescriptor<Presence = any, Profile = any> {
  constructor(init: ClientInitOptions<Presence, Profile>);
  open: () => Promise<Client<Presence, Profile>>;
  readonly current: Client<Presence, Profile> | null;
  readonly readyPromise: Promise<Client<Presence, Profile>>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  close: () => Promise<void>;
}
