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
export interface RecipeSnapshot {
  id: string;
  collectionId: string | null;
  slug: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  ingredients: Array<{
    text: string;
    unit: string | null;
    food: string;
    quantity: number;
    comments: Array<string>;
  }>;
  instructions: any;
}

export interface RecipeInit {
  id?: string;
  collectionId?: string | null;
  slug?: string;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  ingredients?: Array<{
    text: string;
    unit?: string | null;
    food: string;
    quantity?: number;
    comments?: Array<string>;
  }>;
  instructions?: any;
}
export type Recipe = ObjectEntity<RecipeInit>;

export type RecipeIngredients = ListEntity<{
  text: string;
  unit: string | null;
  food: string;
  quantity: number;
  comments: Array<string>;
}>;

export type RecipeIngredientsItem = ObjectEntity<{
  text: string;
  unit: string | null;
  food: string;
  quantity: number;
  comments: Array<string>;
}>;

export type RecipeIngredientsItemComments = ListEntity<string>;

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
  | RecipeSlugMatchFilter
  | RecipeSlugRangeFilter
  | RecipeUpdatedAtMatchFilter
  | RecipeUpdatedAtRangeFilter;

export interface CollectionSnapshot {
  id: string;
  name: string;
}

export interface CollectionInit {
  id?: string;
  name: string;
}
export type Collection = ObjectEntity<CollectionInit>;

export type CollectionFilter = never;

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

export class Client {
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

  presence: Storage["sync"]["presence"];
  sync: Storage["sync"];
  undoHistory: Storage["undoHistory"];
  namespace: Storage["namespace"];
  entities: Storage["entities"];
  queryStore: Storage["queryStore"];

  close: Storage["close"];

  stats: () => Promise<any>;
}

// schema is provided internally. loadInitialData must be revised to pass the typed Client
interface ClientInitOptions
  extends Omit<StorageInitOptions, "schema" | "loadInitialData"> {
  loadInitialData?: (client: Client) => Promise<void>;
}

export class ClientDescriptor {
  constructor(init: ClientInitOptions);
  open: () => Promise<Client>;
  readonly current: Client | null;
  readonly readyPromise: Promise<Client>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  close: () => Promise<void>;
}
