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
export type Recipe = ObjectEntity<RecipeInit, RecipeDestructured>;

export interface RecipeCollectionIdMatchFilter {
  where: "collectionId";
  equals: string | null;
  order?: "asc" | "desc";
}

export interface RecipeCollectionIdRangeFilter {
  where: "collectionId";
  gte?: string | null;
  gt?: string | null;
  lte?: string | null;
  lt?: string | null;
  order?: "asc" | "desc";
}

export interface RecipeCollectionIdStartsWithFilter {
  where: "collectionId";
  startsWith: string;
  order?: "asc" | "desc";
}

export interface RecipeSlugMatchFilter {
  where: "slug";
  equals: string;
  order?: "asc" | "desc";
}

export interface RecipeSlugRangeFilter {
  where: "slug";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface RecipeSlugStartsWithFilter {
  where: "slug";
  startsWith: string;
  order?: "asc" | "desc";
}

export interface RecipeUpdatedAtMatchFilter {
  where: "updatedAt";
  equals: number;
  order?: "asc" | "desc";
}

export interface RecipeUpdatedAtRangeFilter {
  where: "updatedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}

export type RecipeFilter =
  | RecipeCollectionIdMatchFilter
  | RecipeCollectionIdRangeFilter
  | RecipeCollectionIdStartsWithFilter
  | RecipeSlugMatchFilter
  | RecipeSlugRangeFilter
  | RecipeSlugStartsWithFilter
  | RecipeUpdatedAtMatchFilter
  | RecipeUpdatedAtRangeFilter;

export type RecipeDestructured = {
  id: string;
  collectionId: string | null;
  slug: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  ingredients: RecipeIngredients;
  instructions: any;
};
export type RecipeInit = {
  id?: string;
  collectionId?: string | null;
  slug?: string;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  ingredients?: RecipeIngredientsInit;
  instructions?: any;
};
export type RecipeSnapshot = {
  id: string;
  collectionId: string | null;
  slug: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  ingredients: RecipeIngredientsSnapshot;
  instructions: any;
};
/** Recipe sub-object types */

type RecipeId = string;
type RecipeIdInit = RecipeId | undefined;
type RecipeIdSnapshot = RecipeId;
type RecipeIdDestructured = RecipeId;
type RecipeCollectionId = string | null;
type RecipeCollectionIdInit = RecipeCollectionId | undefined;
type RecipeCollectionIdSnapshot = RecipeCollectionId;
type RecipeCollectionIdDestructured = RecipeCollectionId;
type RecipeSlug = string;
type RecipeSlugInit = RecipeSlug | undefined;
type RecipeSlugSnapshot = RecipeSlug;
type RecipeSlugDestructured = RecipeSlug;
type RecipeTitle = string;
type RecipeTitleInit = RecipeTitle | undefined;
type RecipeTitleSnapshot = RecipeTitle;
type RecipeTitleDestructured = RecipeTitle;
type RecipeCreatedAt = number;
type RecipeCreatedAtInit = RecipeCreatedAt | undefined;
type RecipeCreatedAtSnapshot = RecipeCreatedAt;
type RecipeCreatedAtDestructured = RecipeCreatedAt;
type RecipeUpdatedAt = number;
type RecipeUpdatedAtInit = RecipeUpdatedAt | undefined;
type RecipeUpdatedAtSnapshot = RecipeUpdatedAt;
type RecipeUpdatedAtDestructured = RecipeUpdatedAt;
export type RecipeIngredients = ListEntity<
  RecipeIngredientsItemInit,
  RecipeIngredientsItem
>;
export type RecipeIngredientsInit = Array<RecipeIngredientsItemInit>;
export type RecipeIngredientsDestructured = Array<RecipeIngredientsItem>;
export type RecipeIngredientsSnapshot = Array<RecipeIngredientsItemSnapshot>;
export type RecipeIngredientsItem = ObjectEntity<
  RecipeIngredientsItemInit,
  RecipeIngredientsItemDestructured
>;
export type RecipeIngredientsItemInit = {
  text: string;
  unit?: string | null;
  food: string;
  quantity?: number;
  comments?: RecipeIngredientsItemCommentsInit;
};
export type RecipeIngredientsItemDestructured = {
  text: string;
  unit: string | null;
  food: string;
  quantity: number;
  comments: RecipeIngredientsItemComments;
};
export type RecipeIngredientsItemSnapshot = {
  text: string;
  unit: string | null;
  food: string;
  quantity: number;
  comments: RecipeIngredientsItemCommentsSnapshot;
};
type RecipeIngredientsItemText = string;
type RecipeIngredientsItemTextInit = RecipeIngredientsItemText;
type RecipeIngredientsItemTextSnapshot = RecipeIngredientsItemText;
type RecipeIngredientsItemTextDestructured = RecipeIngredientsItemText;
type RecipeIngredientsItemUnit = string | null;
type RecipeIngredientsItemUnitInit = RecipeIngredientsItemUnit | undefined;
type RecipeIngredientsItemUnitSnapshot = RecipeIngredientsItemUnit;
type RecipeIngredientsItemUnitDestructured = RecipeIngredientsItemUnit;
type RecipeIngredientsItemFood = string;
type RecipeIngredientsItemFoodInit = RecipeIngredientsItemFood;
type RecipeIngredientsItemFoodSnapshot = RecipeIngredientsItemFood;
type RecipeIngredientsItemFoodDestructured = RecipeIngredientsItemFood;
type RecipeIngredientsItemQuantity = number;
type RecipeIngredientsItemQuantityInit =
  | RecipeIngredientsItemQuantity
  | undefined;
type RecipeIngredientsItemQuantitySnapshot = RecipeIngredientsItemQuantity;
type RecipeIngredientsItemQuantityDestructured = RecipeIngredientsItemQuantity;
export type RecipeIngredientsItemComments = ListEntity<
  RecipeIngredientsItemCommentsItemInit,
  RecipeIngredientsItemCommentsItem
>;
export type RecipeIngredientsItemCommentsInit =
  Array<RecipeIngredientsItemCommentsItemInit>;
export type RecipeIngredientsItemCommentsDestructured =
  Array<RecipeIngredientsItemCommentsItem>;
export type RecipeIngredientsItemCommentsSnapshot =
  Array<RecipeIngredientsItemCommentsItemSnapshot>;
type RecipeIngredientsItemCommentsItem = string;
type RecipeIngredientsItemCommentsItemInit = RecipeIngredientsItemCommentsItem;
type RecipeIngredientsItemCommentsItemSnapshot =
  RecipeIngredientsItemCommentsItem;
type RecipeIngredientsItemCommentsItemDestructured =
  RecipeIngredientsItemCommentsItem;
type RecipeInstructions = any;
type RecipeInstructionsInit = RecipeInstructions | undefined;
type RecipeInstructionsSnapshot = RecipeInstructions;
type RecipeInstructionsDestructured = RecipeInstructions;

export type Collection = ObjectEntity<CollectionInit, CollectionDestructured>;

export type CollectionFilter = never;
export type CollectionDestructured = {
  id: string;
  name: string;
};
export type CollectionInit = {
  id?: string;
  name: string;
};
export type CollectionSnapshot = {
  id: string;
  name: string;
};
/** Collection sub-object types */

type CollectionId = string;
type CollectionIdInit = CollectionId | undefined;
type CollectionIdSnapshot = CollectionId;
type CollectionIdDestructured = CollectionId;
type CollectionName = string;
type CollectionNameInit = CollectionName;
type CollectionNameSnapshot = CollectionName;
type CollectionNameDestructured = CollectionName;

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
  readonly recipes: Collection<
    Recipe,
    RecipeSnapshot,
    RecipeInit,
    RecipeFilter
  >;

  readonly collections: Collection<
    Collection,
    CollectionSnapshot,
    CollectionInit,
    CollectionFilter
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
  extends Omit<StorageInitOptions<Presence, Profile>, "schema"> {}

export class ClientDescriptor<Presence = any, Profile = any> {
  constructor(init: ClientInitOptions<Presence, Profile>);
  open: () => Promise<Client<Presence, Profile>>;
  readonly current: Client<Presence, Profile> | null;
  readonly readyPromise: Promise<Client<Presence, Profile>>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  close: () => Promise<void>;
}
