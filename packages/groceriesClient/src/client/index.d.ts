import type schema from "./schema.js";
import type { StorageSchema } from "@lo-fi/common";
import type {
  Storage,
  StorageInitOptions,
  ObjectEntity,
  ListEntity,
  Query,
  ServerSync,
  EntityFile,
} from "@lo-fi/web";
export * from "@lo-fi/web";
export type Schema = typeof schema;

interface Collection<
  Document extends ObjectEntity<any, any>,
  Snapshot,
  Init,
  Filter
> {
  /**
   * @deprecated use put
   */
  create: (init: Init, options?: { undoable?: boolean }) => Promise<Document>;
  put: (init: Init, options?: { undoable?: boolean }) => Promise<Document>;
  delete: (id: string, options?: { undoable?: boolean }) => Promise<void>;
  deleteAll: (ids: string[], options?: { undoable?: boolean }) => Promise<void>;
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

  readonly foods: Collection<Food, FoodSnapshot, FoodInit, FoodFilter>;

  readonly suggestions: Collection<
    Suggestion,
    SuggestionSnapshot,
    SuggestionInit,
    SuggestionFilter
  >;

  readonly lists: Collection<List, ListSnapshot, ListInit, ListFilter>;

  readonly collaborationInfo: Collection<
    CollaborationInfo,
    CollaborationInfoSnapshot,
    CollaborationInfoInit,
    CollaborationInfoFilter
  >;

  readonly recipes: Collection<
    Recipe,
    RecipeSnapshot,
    RecipeInit,
    RecipeFilter
  >;

  readonly recipeTagMetadata: Collection<
    RecipeTagMetadata,
    RecipeTagMetadataSnapshot,
    RecipeTagMetadataInit,
    RecipeTagMetadataFilter
  >;

  sync: ServerSync<Profile, Presence>;
  undoHistory: Storage["undoHistory"];
  namespace: Storage["namespace"];
  entities: Storage["entities"];
  queryStore: Storage["queryStore"];
  batch: Storage["batch"];
  files: Storage["files"];

  close: Storage["close"];

  export: Storage["export"];
  import: Storage["import"];

  stats: () => Promise<any>;
  /**
   * Resets all local data. Use with caution. If this replica
   * is synced, it can restore from the server, but if it is not,
   * the data will be permanently lost.
   */
  __dangerous__resetLocal: Storage["__dangerous__resetLocal"];
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
export type Category = ObjectEntity<CategoryInit, CategoryDestructured>;

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

export type CategoryDestructured = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaim | null;
};
export type CategoryInit = {
  id?: string;
  name: string;
  sortKey?: string;
  expirationDays?: number | null;
  claim?: CategoryClaimInit | null;
};
export type CategorySnapshot = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaimSnapshot | null;
};
/** Category sub-object types */

type CategoryId = string;
type CategoryIdInit = CategoryId | undefined;
type CategoryIdSnapshot = CategoryId;
type CategoryIdDestructured = CategoryId;
type CategoryName = string;
type CategoryNameInit = CategoryName;
type CategoryNameSnapshot = CategoryName;
type CategoryNameDestructured = CategoryName;
type CategorySortKey = string;
type CategorySortKeyInit = CategorySortKey | undefined;
type CategorySortKeySnapshot = CategorySortKey;
type CategorySortKeyDestructured = CategorySortKey;
type CategoryExpirationDays = number | null;
type CategoryExpirationDaysInit = CategoryExpirationDays | undefined;
type CategoryExpirationDaysSnapshot = CategoryExpirationDays;
type CategoryExpirationDaysDestructured = CategoryExpirationDays;
export type CategoryClaim = ObjectEntity<
  CategoryClaimInit,
  CategoryClaimDestructured
>;
export type CategoryClaimInit = {
  claimedBy: string;
  claimedAt: number;
};
export type CategoryClaimDestructured = {
  claimedBy: string;
  claimedAt: number;
};
export type CategoryClaimSnapshot = {
  claimedBy: string;
  claimedAt: number;
};
type CategoryClaimClaimedBy = string;
type CategoryClaimClaimedByInit = CategoryClaimClaimedBy;
type CategoryClaimClaimedBySnapshot = CategoryClaimClaimedBy;
type CategoryClaimClaimedByDestructured = CategoryClaimClaimedBy;
type CategoryClaimClaimedAt = number;
type CategoryClaimClaimedAtInit = CategoryClaimClaimedAt;
type CategoryClaimClaimedAtSnapshot = CategoryClaimClaimedAt;
type CategoryClaimClaimedAtDestructured = CategoryClaimClaimedAt;

export type Item = ObjectEntity<ItemInit, ItemDestructured>;

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

export interface ItemPurchasedFoodListIdCompoundFilter {
  where: "purchased_food_listId";
  match: {
    purchased?: string;
    food?: string;
    listId?: string;
  };
  order: "asc" | "desc";
}

export interface ItemPurchasedListIdCompoundFilter {
  where: "purchased_listId";
  match: {
    purchased?: string;
    listId?: string;
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

export interface ItemListIdMatchFilter {
  where: "listId";
  equals: string;
  order?: "asc" | "desc";
}

export interface ItemListIdRangeFilter {
  where: "listId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export interface ItemListIdStartsWithFilter {
  where: "listId";
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
  | ItemPurchasedFoodListIdCompoundFilter
  | ItemPurchasedListIdCompoundFilter
  | ItemPurchasedMatchFilter
  | ItemPurchasedRangeFilter
  | ItemPurchasedStartsWithFilter
  | ItemListIdMatchFilter
  | ItemListIdRangeFilter
  | ItemListIdStartsWithFilter;

export type ItemDestructured = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputs;
  purchasedAt: number | null;
  expiredAt: number | null;
  listId: string | null;
  comment: string | null;
};
export type ItemInit = {
  id?: string;
  categoryId?: string | null;
  createdAt?: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs?: ItemInputsInit;
  purchasedAt?: number | null;
  expiredAt?: number | null;
  listId?: string | null;
  comment?: string | null;
};
export type ItemSnapshot = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputsSnapshot;
  purchasedAt: number | null;
  expiredAt: number | null;
  listId: string | null;
  comment: string | null;
};
/** Item sub-object types */

type ItemId = string;
type ItemIdInit = ItemId | undefined;
type ItemIdSnapshot = ItemId;
type ItemIdDestructured = ItemId;
type ItemCategoryId = string | null;
type ItemCategoryIdInit = ItemCategoryId | undefined;
type ItemCategoryIdSnapshot = ItemCategoryId;
type ItemCategoryIdDestructured = ItemCategoryId;
type ItemCreatedAt = number;
type ItemCreatedAtInit = ItemCreatedAt | undefined;
type ItemCreatedAtSnapshot = ItemCreatedAt;
type ItemCreatedAtDestructured = ItemCreatedAt;
type ItemTotalQuantity = number;
type ItemTotalQuantityInit = ItemTotalQuantity;
type ItemTotalQuantitySnapshot = ItemTotalQuantity;
type ItemTotalQuantityDestructured = ItemTotalQuantity;
type ItemUnit = string;
type ItemUnitInit = ItemUnit;
type ItemUnitSnapshot = ItemUnit;
type ItemUnitDestructured = ItemUnit;
type ItemFood = string;
type ItemFoodInit = ItemFood;
type ItemFoodSnapshot = ItemFood;
type ItemFoodDestructured = ItemFood;
export type ItemInputs = ListEntity<ItemInputsInit, ItemInputsDestructured>;
export type ItemInputsInit = Array<ItemInputsItemInit>;
export type ItemInputsDestructured = Array<ItemInputsItem>;
export type ItemInputsSnapshot = Array<ItemInputsItemSnapshot>;
export type ItemInputsItem = ObjectEntity<
  ItemInputsItemInit,
  ItemInputsItemDestructured
>;
export type ItemInputsItemInit = {
  text: string;
  url?: string | null;
  title?: string | null;
  multiplier?: number | null;
  recipeId?: string | null;
};
export type ItemInputsItemDestructured = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
};
export type ItemInputsItemSnapshot = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
};
type ItemInputsItemText = string;
type ItemInputsItemTextInit = ItemInputsItemText;
type ItemInputsItemTextSnapshot = ItemInputsItemText;
type ItemInputsItemTextDestructured = ItemInputsItemText;
type ItemInputsItemUrl = string | null;
type ItemInputsItemUrlInit = ItemInputsItemUrl | undefined;
type ItemInputsItemUrlSnapshot = ItemInputsItemUrl;
type ItemInputsItemUrlDestructured = ItemInputsItemUrl;
type ItemInputsItemTitle = string | null;
type ItemInputsItemTitleInit = ItemInputsItemTitle | undefined;
type ItemInputsItemTitleSnapshot = ItemInputsItemTitle;
type ItemInputsItemTitleDestructured = ItemInputsItemTitle;
type ItemInputsItemMultiplier = number | null;
type ItemInputsItemMultiplierInit = ItemInputsItemMultiplier | undefined;
type ItemInputsItemMultiplierSnapshot = ItemInputsItemMultiplier;
type ItemInputsItemMultiplierDestructured = ItemInputsItemMultiplier;
type ItemInputsItemRecipeId = string | null;
type ItemInputsItemRecipeIdInit = ItemInputsItemRecipeId | undefined;
type ItemInputsItemRecipeIdSnapshot = ItemInputsItemRecipeId;
type ItemInputsItemRecipeIdDestructured = ItemInputsItemRecipeId;

type ItemPurchasedAt = number | null;
type ItemPurchasedAtInit = ItemPurchasedAt | undefined;
type ItemPurchasedAtSnapshot = ItemPurchasedAt;
type ItemPurchasedAtDestructured = ItemPurchasedAt;
type ItemExpiredAt = number | null;
type ItemExpiredAtInit = ItemExpiredAt | undefined;
type ItemExpiredAtSnapshot = ItemExpiredAt;
type ItemExpiredAtDestructured = ItemExpiredAt;
type ItemListId = string | null;
type ItemListIdInit = ItemListId | undefined;
type ItemListIdSnapshot = ItemListId;
type ItemListIdDestructured = ItemListId;
type ItemComment = string | null;
type ItemCommentInit = ItemComment | undefined;
type ItemCommentSnapshot = ItemComment;
type ItemCommentDestructured = ItemComment;

export type Food = ObjectEntity<FoodInit, FoodDestructured>;

export interface FoodCategoryIdMatchFilter {
  where: "categoryId";
  equals: string | null;
  order?: "asc" | "desc";
}

export interface FoodCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string | null;
  gt?: string | null;
  lte?: string | null;
  lt?: string | null;
  order?: "asc" | "desc";
}

export interface FoodCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
  order?: "asc" | "desc";
}

export interface FoodNameLookupMatchFilter {
  where: "nameLookup";
  equals: string;
  order?: "asc" | "desc";
}

export interface FoodNameLookupRangeFilter {
  where: "nameLookup";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export type FoodFilter =
  | FoodCategoryIdMatchFilter
  | FoodCategoryIdRangeFilter
  | FoodCategoryIdStartsWithFilter
  | FoodNameLookupMatchFilter
  | FoodNameLookupRangeFilter;

export type FoodDestructured = {
  canonicalName: string;
  alternateNames: FoodAlternateNames;
  categoryId: string | null;
  isPerishable: boolean;
  isStaple: boolean;
  expiresAfterDays: number | null;
};
export type FoodInit = {
  canonicalName: string;
  alternateNames?: FoodAlternateNamesInit;
  categoryId?: string | null;
  isPerishable: boolean;
  isStaple: boolean;
  expiresAfterDays?: number | null;
};
export type FoodSnapshot = {
  canonicalName: string;
  alternateNames: FoodAlternateNamesSnapshot;
  categoryId: string | null;
  isPerishable: boolean;
  isStaple: boolean;
  expiresAfterDays: number | null;
};
/** Food sub-object types */

type FoodCanonicalName = string;
type FoodCanonicalNameInit = FoodCanonicalName;
type FoodCanonicalNameSnapshot = FoodCanonicalName;
type FoodCanonicalNameDestructured = FoodCanonicalName;
export type FoodAlternateNames = ListEntity<
  FoodAlternateNamesInit,
  FoodAlternateNamesDestructured
>;
export type FoodAlternateNamesInit = Array<FoodAlternateNamesItemInit>;
export type FoodAlternateNamesDestructured = Array<FoodAlternateNamesItem>;
export type FoodAlternateNamesSnapshot = Array<FoodAlternateNamesItemSnapshot>;
type FoodAlternateNamesItem = string;
type FoodAlternateNamesItemInit = FoodAlternateNamesItem;
type FoodAlternateNamesItemSnapshot = FoodAlternateNamesItem;
type FoodAlternateNamesItemDestructured = FoodAlternateNamesItem;
type FoodCategoryId = string | null;
type FoodCategoryIdInit = FoodCategoryId | undefined;
type FoodCategoryIdSnapshot = FoodCategoryId;
type FoodCategoryIdDestructured = FoodCategoryId;
type FoodIsPerishable = boolean;
type FoodIsPerishableInit = FoodIsPerishable;
type FoodIsPerishableSnapshot = FoodIsPerishable;
type FoodIsPerishableDestructured = FoodIsPerishable;
type FoodIsStaple = boolean;
type FoodIsStapleInit = FoodIsStaple;
type FoodIsStapleSnapshot = FoodIsStaple;
type FoodIsStapleDestructured = FoodIsStaple;
type FoodExpiresAfterDays = number | null;
type FoodExpiresAfterDaysInit = FoodExpiresAfterDays | undefined;
type FoodExpiresAfterDaysSnapshot = FoodExpiresAfterDays;
type FoodExpiresAfterDaysDestructured = FoodExpiresAfterDays;

export type Suggestion = ObjectEntity<SuggestionInit, SuggestionDestructured>;

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

export type SuggestionDestructured = {
  text: string;
  usageCount: number;
};
export type SuggestionInit = {
  text: string;
  usageCount?: number;
};
export type SuggestionSnapshot = {
  text: string;
  usageCount: number;
};
/** Suggestion sub-object types */

type SuggestionText = string;
type SuggestionTextInit = SuggestionText;
type SuggestionTextSnapshot = SuggestionText;
type SuggestionTextDestructured = SuggestionText;
type SuggestionUsageCount = number;
type SuggestionUsageCountInit = SuggestionUsageCount | undefined;
type SuggestionUsageCountSnapshot = SuggestionUsageCount;
type SuggestionUsageCountDestructured = SuggestionUsageCount;

export type List = ObjectEntity<ListInit, ListDestructured>;

export type ListFilter = never;
export type ListDestructured = {
  id: string;
  name: string;
  color: string;
};
export type ListInit = {
  id?: string;
  name: string;
  color: string;
};
export type ListSnapshot = {
  id: string;
  name: string;
  color: string;
};
/** List sub-object types */

type ListId = string;
type ListIdInit = ListId | undefined;
type ListIdSnapshot = ListId;
type ListIdDestructured = ListId;
type ListName = string;
type ListNameInit = ListName;
type ListNameSnapshot = ListName;
type ListNameDestructured = ListName;
type ListColor = string;
type ListColorInit = ListColor;
type ListColorSnapshot = ListColor;
type ListColorDestructured = ListColor;

export type CollaborationInfo = ObjectEntity<
  CollaborationInfoInit,
  CollaborationInfoDestructured
>;

export type CollaborationInfoFilter = never;
export type CollaborationInfoDestructured = {
  id: string;
  meetup: CollaborationInfoMeetup | null;
};
export type CollaborationInfoInit = {
  id?: string;
  meetup?: CollaborationInfoMeetupInit | null;
};
export type CollaborationInfoSnapshot = {
  id: string;
  meetup: CollaborationInfoMeetupSnapshot | null;
};
/** CollaborationInfo sub-object types */

type CollaborationInfoId = string;
type CollaborationInfoIdInit = CollaborationInfoId | undefined;
type CollaborationInfoIdSnapshot = CollaborationInfoId;
type CollaborationInfoIdDestructured = CollaborationInfoId;
export type CollaborationInfoMeetup = ObjectEntity<
  CollaborationInfoMeetupInit,
  CollaborationInfoMeetupDestructured
>;
export type CollaborationInfoMeetupInit = {
  createdAt?: number;
  location: string;
};
export type CollaborationInfoMeetupDestructured = {
  createdAt: number;
  location: string;
};
export type CollaborationInfoMeetupSnapshot = {
  createdAt: number;
  location: string;
};
type CollaborationInfoMeetupCreatedAt = number;
type CollaborationInfoMeetupCreatedAtInit =
  | CollaborationInfoMeetupCreatedAt
  | undefined;
type CollaborationInfoMeetupCreatedAtSnapshot =
  CollaborationInfoMeetupCreatedAt;
type CollaborationInfoMeetupCreatedAtDestructured =
  CollaborationInfoMeetupCreatedAt;
type CollaborationInfoMeetupLocation = string;
type CollaborationInfoMeetupLocationInit = CollaborationInfoMeetupLocation;
type CollaborationInfoMeetupLocationSnapshot = CollaborationInfoMeetupLocation;
type CollaborationInfoMeetupLocationDestructured =
  CollaborationInfoMeetupLocation;

export type Recipe = ObjectEntity<RecipeInit, RecipeDestructured>;

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

export interface RecipeTagMatchFilter {
  where: "tag";
  equals: string;
  order?: "asc" | "desc";
}

export interface RecipeTagRangeFilter {
  where: "tag";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}

export type RecipeFilter =
  | RecipeSlugMatchFilter
  | RecipeSlugRangeFilter
  | RecipeSlugStartsWithFilter
  | RecipeUpdatedAtMatchFilter
  | RecipeUpdatedAtRangeFilter
  | RecipeTagMatchFilter
  | RecipeTagRangeFilter;

export type RecipeDestructured = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  ingredients: RecipeIngredients;
  instructions: any;
  url: string | null;
  session: RecipeSession | null;
  tags: RecipeTags;
  mainImage: RecipeMainImage | null;
};
export type RecipeInit = {
  id?: string;
  slug?: string;
  multiplier?: number;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  ingredients?: RecipeIngredientsInit;
  instructions?: any;
  url?: string | null;
  session?: RecipeSessionInit | null;
  tags?: RecipeTagsInit;
  mainImage?: RecipeMainImageInit | null;
};
export type RecipeSnapshot = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  ingredients: RecipeIngredientsSnapshot;
  instructions: any;
  url: string | null;
  session: RecipeSessionSnapshot | null;
  tags: RecipeTagsSnapshot;
  mainImage: RecipeMainImageSnapshot | null;
};
/** Recipe sub-object types */

type RecipeId = string;
type RecipeIdInit = RecipeId | undefined;
type RecipeIdSnapshot = RecipeId;
type RecipeIdDestructured = RecipeId;
type RecipeSlug = string;
type RecipeSlugInit = RecipeSlug | undefined;
type RecipeSlugSnapshot = RecipeSlug;
type RecipeSlugDestructured = RecipeSlug;
type RecipeMultiplier = number;
type RecipeMultiplierInit = RecipeMultiplier | undefined;
type RecipeMultiplierSnapshot = RecipeMultiplier;
type RecipeMultiplierDestructured = RecipeMultiplier;
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
  RecipeIngredientsInit,
  RecipeIngredientsDestructured
>;
export type RecipeIngredientsInit = Array<RecipeIngredientsItemInit>;
export type RecipeIngredientsDestructured = Array<RecipeIngredientsItem>;
export type RecipeIngredientsSnapshot = Array<RecipeIngredientsItemSnapshot>;
export type RecipeIngredientsItem = ObjectEntity<
  RecipeIngredientsItemInit,
  RecipeIngredientsItemDestructured
>;
export type RecipeIngredientsItemInit = {
  id?: string;
  text: string;
  unit?: string | null;
  food: string;
  quantity?: number;
  comments?: RecipeIngredientsItemCommentsInit;
};
export type RecipeIngredientsItemDestructured = {
  id: string;
  text: string;
  unit: string | null;
  food: string;
  quantity: number;
  comments: RecipeIngredientsItemComments;
};
export type RecipeIngredientsItemSnapshot = {
  id: string;
  text: string;
  unit: string | null;
  food: string;
  quantity: number;
  comments: RecipeIngredientsItemCommentsSnapshot;
};
type RecipeIngredientsItemId = string;
type RecipeIngredientsItemIdInit = RecipeIngredientsItemId | undefined;
type RecipeIngredientsItemIdSnapshot = RecipeIngredientsItemId;
type RecipeIngredientsItemIdDestructured = RecipeIngredientsItemId;
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
  RecipeIngredientsItemCommentsInit,
  RecipeIngredientsItemCommentsDestructured
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
type RecipeUrl = string | null;
type RecipeUrlInit = RecipeUrl | undefined;
type RecipeUrlSnapshot = RecipeUrl;
type RecipeUrlDestructured = RecipeUrl;
export type RecipeSession = ObjectEntity<
  RecipeSessionInit,
  RecipeSessionDestructured
>;
export type RecipeSessionInit = {
  startedAt?: number;
  completedInstructions?: RecipeSessionCompletedInstructionsInit;
  completedIngredients?: RecipeSessionCompletedIngredientsInit;
  instructionAssignments?: RecipeSessionInstructionAssignmentsInit;
  ingredientAssignments?: RecipeSessionIngredientAssignmentsInit;
};
export type RecipeSessionDestructured = {
  startedAt: number;
  completedInstructions: RecipeSessionCompletedInstructions;
  completedIngredients: RecipeSessionCompletedIngredients;
  instructionAssignments: RecipeSessionInstructionAssignments;
  ingredientAssignments: RecipeSessionIngredientAssignments;
};
export type RecipeSessionSnapshot = {
  startedAt: number;
  completedInstructions: RecipeSessionCompletedInstructionsSnapshot;
  completedIngredients: RecipeSessionCompletedIngredientsSnapshot;
  instructionAssignments: RecipeSessionInstructionAssignmentsSnapshot;
  ingredientAssignments: RecipeSessionIngredientAssignmentsSnapshot;
};
type RecipeSessionStartedAt = number;
type RecipeSessionStartedAtInit = RecipeSessionStartedAt | undefined;
type RecipeSessionStartedAtSnapshot = RecipeSessionStartedAt;
type RecipeSessionStartedAtDestructured = RecipeSessionStartedAt;
export type RecipeSessionCompletedInstructions = ListEntity<
  RecipeSessionCompletedInstructionsInit,
  RecipeSessionCompletedInstructionsDestructured
>;
export type RecipeSessionCompletedInstructionsInit =
  Array<RecipeSessionCompletedInstructionsItemInit>;
export type RecipeSessionCompletedInstructionsDestructured =
  Array<RecipeSessionCompletedInstructionsItem>;
export type RecipeSessionCompletedInstructionsSnapshot =
  Array<RecipeSessionCompletedInstructionsItemSnapshot>;
type RecipeSessionCompletedInstructionsItem = string;
type RecipeSessionCompletedInstructionsItemInit =
  RecipeSessionCompletedInstructionsItem;
type RecipeSessionCompletedInstructionsItemSnapshot =
  RecipeSessionCompletedInstructionsItem;
type RecipeSessionCompletedInstructionsItemDestructured =
  RecipeSessionCompletedInstructionsItem;
export type RecipeSessionCompletedIngredients = ListEntity<
  RecipeSessionCompletedIngredientsInit,
  RecipeSessionCompletedIngredientsDestructured
>;
export type RecipeSessionCompletedIngredientsInit =
  Array<RecipeSessionCompletedIngredientsItemInit>;
export type RecipeSessionCompletedIngredientsDestructured =
  Array<RecipeSessionCompletedIngredientsItem>;
export type RecipeSessionCompletedIngredientsSnapshot =
  Array<RecipeSessionCompletedIngredientsItemSnapshot>;
type RecipeSessionCompletedIngredientsItem = string;
type RecipeSessionCompletedIngredientsItemInit =
  RecipeSessionCompletedIngredientsItem;
type RecipeSessionCompletedIngredientsItemSnapshot =
  RecipeSessionCompletedIngredientsItem;
type RecipeSessionCompletedIngredientsItemDestructured =
  RecipeSessionCompletedIngredientsItem;
export type RecipeSessionInstructionAssignments = ObjectEntity<
  RecipeSessionInstructionAssignmentsInit,
  RecipeSessionInstructionAssignmentsDestructured
>;
export type RecipeSessionInstructionAssignmentsInit = Record<
  string,
  RecipeSessionInstructionAssignmentsValueInit
>;
export type RecipeSessionInstructionAssignmentsDestructured = {
  [key: string]: RecipeSessionInstructionAssignmentsValue | undefined;
};
export type RecipeSessionInstructionAssignmentsSnapshot = Record<
  string,
  RecipeSessionInstructionAssignmentsValueSnapshot
>;
type RecipeSessionInstructionAssignmentsValue = string;
type RecipeSessionInstructionAssignmentsValueInit =
  RecipeSessionInstructionAssignmentsValue;
type RecipeSessionInstructionAssignmentsValueSnapshot =
  RecipeSessionInstructionAssignmentsValue;
type RecipeSessionInstructionAssignmentsValueDestructured =
  RecipeSessionInstructionAssignmentsValue;

export type RecipeSessionIngredientAssignments = ObjectEntity<
  RecipeSessionIngredientAssignmentsInit,
  RecipeSessionIngredientAssignmentsDestructured
>;
export type RecipeSessionIngredientAssignmentsInit = Record<
  string,
  RecipeSessionIngredientAssignmentsValueInit
>;
export type RecipeSessionIngredientAssignmentsDestructured = {
  [key: string]: RecipeSessionIngredientAssignmentsValue | undefined;
};
export type RecipeSessionIngredientAssignmentsSnapshot = Record<
  string,
  RecipeSessionIngredientAssignmentsValueSnapshot
>;
type RecipeSessionIngredientAssignmentsValue = string;
type RecipeSessionIngredientAssignmentsValueInit =
  RecipeSessionIngredientAssignmentsValue;
type RecipeSessionIngredientAssignmentsValueSnapshot =
  RecipeSessionIngredientAssignmentsValue;
type RecipeSessionIngredientAssignmentsValueDestructured =
  RecipeSessionIngredientAssignmentsValue;

export type RecipeTags = ListEntity<RecipeTagsInit, RecipeTagsDestructured>;
export type RecipeTagsInit = Array<RecipeTagsItemInit>;
export type RecipeTagsDestructured = Array<RecipeTagsItem>;
export type RecipeTagsSnapshot = Array<RecipeTagsItemSnapshot>;
type RecipeTagsItem = string;
type RecipeTagsItemInit = RecipeTagsItem;
type RecipeTagsItemSnapshot = RecipeTagsItem;
type RecipeTagsItemDestructured = RecipeTagsItem;
export type RecipeMainImage = EntityFile;
export type RecipeMainImageInit = File;
export type RecipeMainImageDestructured = EntityFile;
export type RecipeMainImageSnapshot = string;

export type RecipeTagMetadata = ObjectEntity<
  RecipeTagMetadataInit,
  RecipeTagMetadataDestructured
>;

export type RecipeTagMetadataFilter = never;
export type RecipeTagMetadataDestructured = {
  name: string;
  color: string | null;
  icon: string | null;
};
export type RecipeTagMetadataInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};
export type RecipeTagMetadataSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};
/** RecipeTagMetadata sub-object types */

type RecipeTagMetadataName = string;
type RecipeTagMetadataNameInit = RecipeTagMetadataName;
type RecipeTagMetadataNameSnapshot = RecipeTagMetadataName;
type RecipeTagMetadataNameDestructured = RecipeTagMetadataName;
type RecipeTagMetadataColor = string | null;
type RecipeTagMetadataColorInit = RecipeTagMetadataColor | undefined;
type RecipeTagMetadataColorSnapshot = RecipeTagMetadataColor;
type RecipeTagMetadataColorDestructured = RecipeTagMetadataColor;
type RecipeTagMetadataIcon = string | null;
type RecipeTagMetadataIconInit = RecipeTagMetadataIcon | undefined;
type RecipeTagMetadataIconSnapshot = RecipeTagMetadataIcon;
type RecipeTagMetadataIconDestructured = RecipeTagMetadataIcon;
