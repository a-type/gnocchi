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

export type CategoryId = string;
export type CategoryIdInit = CategoryId | undefined;
export type CategoryIdSnapshot = CategoryId;
export type CategoryIdDestructured = CategoryId;
export type CategoryName = string;
export type CategoryNameInit = CategoryName;
export type CategoryNameSnapshot = CategoryName;
export type CategoryNameDestructured = CategoryName;
export type CategorySortKey = string;
export type CategorySortKeyInit = CategorySortKey | undefined;
export type CategorySortKeySnapshot = CategorySortKey;
export type CategorySortKeyDestructured = CategorySortKey;
export type CategoryExpirationDays = number | null;
export type CategoryExpirationDaysInit = CategoryExpirationDays | undefined;
export type CategoryExpirationDaysSnapshot = CategoryExpirationDays;
export type CategoryExpirationDaysDestructured = CategoryExpirationDays;
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
export type CategoryClaimClaimedBy = string;
export type CategoryClaimClaimedByInit = CategoryClaimClaimedBy;
export type CategoryClaimClaimedBySnapshot = CategoryClaimClaimedBy;
export type CategoryClaimClaimedByDestructured = CategoryClaimClaimedBy;
export type CategoryClaimClaimedAt = number;
export type CategoryClaimClaimedAtInit = CategoryClaimClaimedAt;
export type CategoryClaimClaimedAtSnapshot = CategoryClaimClaimedAt;
export type CategoryClaimClaimedAtDestructured = CategoryClaimClaimedAt;

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

export interface ItemPurchasedAndExpiresAtMatchFilter {
  where: "purchasedAndExpiresAt";
  equals: number;
  order?: "asc" | "desc";
}

export interface ItemPurchasedAndExpiresAtRangeFilter {
  where: "purchasedAndExpiresAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
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
  | ItemListIdStartsWithFilter
  | ItemPurchasedAndExpiresAtMatchFilter
  | ItemPurchasedAndExpiresAtRangeFilter;

export type ItemDestructured = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputs;
  purchasedAt: number | null;
  expiresAt: number | null;
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
  expiresAt?: number | null;
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
  expiresAt: number | null;
  listId: string | null;
  comment: string | null;
};
/** Item sub-object types */

export type ItemId = string;
export type ItemIdInit = ItemId | undefined;
export type ItemIdSnapshot = ItemId;
export type ItemIdDestructured = ItemId;
export type ItemCategoryId = string | null;
export type ItemCategoryIdInit = ItemCategoryId | undefined;
export type ItemCategoryIdSnapshot = ItemCategoryId;
export type ItemCategoryIdDestructured = ItemCategoryId;
export type ItemCreatedAt = number;
export type ItemCreatedAtInit = ItemCreatedAt | undefined;
export type ItemCreatedAtSnapshot = ItemCreatedAt;
export type ItemCreatedAtDestructured = ItemCreatedAt;
export type ItemTotalQuantity = number;
export type ItemTotalQuantityInit = ItemTotalQuantity;
export type ItemTotalQuantitySnapshot = ItemTotalQuantity;
export type ItemTotalQuantityDestructured = ItemTotalQuantity;
export type ItemUnit = string;
export type ItemUnitInit = ItemUnit;
export type ItemUnitSnapshot = ItemUnit;
export type ItemUnitDestructured = ItemUnit;
export type ItemFood = string;
export type ItemFoodInit = ItemFood;
export type ItemFoodSnapshot = ItemFood;
export type ItemFoodDestructured = ItemFood;
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
  quantity?: number | null;
};
export type ItemInputsItemDestructured = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
  quantity: number | null;
};
export type ItemInputsItemSnapshot = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
  quantity: number | null;
};
export type ItemInputsItemText = string;
export type ItemInputsItemTextInit = ItemInputsItemText;
export type ItemInputsItemTextSnapshot = ItemInputsItemText;
export type ItemInputsItemTextDestructured = ItemInputsItemText;
export type ItemInputsItemUrl = string | null;
export type ItemInputsItemUrlInit = ItemInputsItemUrl | undefined;
export type ItemInputsItemUrlSnapshot = ItemInputsItemUrl;
export type ItemInputsItemUrlDestructured = ItemInputsItemUrl;
export type ItemInputsItemTitle = string | null;
export type ItemInputsItemTitleInit = ItemInputsItemTitle | undefined;
export type ItemInputsItemTitleSnapshot = ItemInputsItemTitle;
export type ItemInputsItemTitleDestructured = ItemInputsItemTitle;
export type ItemInputsItemMultiplier = number | null;
export type ItemInputsItemMultiplierInit = ItemInputsItemMultiplier | undefined;
export type ItemInputsItemMultiplierSnapshot = ItemInputsItemMultiplier;
export type ItemInputsItemMultiplierDestructured = ItemInputsItemMultiplier;
export type ItemInputsItemRecipeId = string | null;
export type ItemInputsItemRecipeIdInit = ItemInputsItemRecipeId | undefined;
export type ItemInputsItemRecipeIdSnapshot = ItemInputsItemRecipeId;
export type ItemInputsItemRecipeIdDestructured = ItemInputsItemRecipeId;
export type ItemInputsItemQuantity = number | null;
export type ItemInputsItemQuantityInit = ItemInputsItemQuantity | undefined;
export type ItemInputsItemQuantitySnapshot = ItemInputsItemQuantity;
export type ItemInputsItemQuantityDestructured = ItemInputsItemQuantity;

export type ItemPurchasedAt = number | null;
export type ItemPurchasedAtInit = ItemPurchasedAt | undefined;
export type ItemPurchasedAtSnapshot = ItemPurchasedAt;
export type ItemPurchasedAtDestructured = ItemPurchasedAt;
export type ItemExpiresAt = number | null;
export type ItemExpiresAtInit = ItemExpiresAt | undefined;
export type ItemExpiresAtSnapshot = ItemExpiresAt;
export type ItemExpiresAtDestructured = ItemExpiresAt;
export type ItemListId = string | null;
export type ItemListIdInit = ItemListId | undefined;
export type ItemListIdSnapshot = ItemListId;
export type ItemListIdDestructured = ItemListId;
export type ItemComment = string | null;
export type ItemCommentInit = ItemComment | undefined;
export type ItemCommentSnapshot = ItemComment;
export type ItemCommentDestructured = ItemComment;

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

export interface FoodRepurchaseAfterMatchFilter {
  where: "repurchaseAfter";
  equals: number;
  order?: "asc" | "desc";
}

export interface FoodRepurchaseAfterRangeFilter {
  where: "repurchaseAfter";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}

export type FoodFilter =
  | FoodCategoryIdMatchFilter
  | FoodCategoryIdRangeFilter
  | FoodCategoryIdStartsWithFilter
  | FoodNameLookupMatchFilter
  | FoodNameLookupRangeFilter
  | FoodRepurchaseAfterMatchFilter
  | FoodRepurchaseAfterRangeFilter;

export type FoodDestructured = {
  canonicalName: string;
  alternateNames: FoodAlternateNames;
  categoryId: string | null;
  expiresAfterDays: number | null;
  lastPurchasedAt: number | null;
  purchaseIntervalGuess: number | null;
  lastAddedAt: number | null;
  purchaseCount: number;
  defaultListId: string | null;
  pluralizeName: boolean;
};
export type FoodInit = {
  canonicalName: string;
  alternateNames?: FoodAlternateNamesInit;
  categoryId?: string | null;
  expiresAfterDays?: number | null;
  lastPurchasedAt?: number | null;
  purchaseIntervalGuess?: number | null;
  lastAddedAt?: number | null;
  purchaseCount?: number;
  defaultListId?: string | null;
  pluralizeName?: boolean;
};
export type FoodSnapshot = {
  canonicalName: string;
  alternateNames: FoodAlternateNamesSnapshot;
  categoryId: string | null;
  expiresAfterDays: number | null;
  lastPurchasedAt: number | null;
  purchaseIntervalGuess: number | null;
  lastAddedAt: number | null;
  purchaseCount: number;
  defaultListId: string | null;
  pluralizeName: boolean;
};
/** Food sub-object types */

export type FoodCanonicalName = string;
export type FoodCanonicalNameInit = FoodCanonicalName;
export type FoodCanonicalNameSnapshot = FoodCanonicalName;
export type FoodCanonicalNameDestructured = FoodCanonicalName;
export type FoodAlternateNames = ListEntity<
  FoodAlternateNamesInit,
  FoodAlternateNamesDestructured
>;
export type FoodAlternateNamesInit = Array<FoodAlternateNamesItemInit>;
export type FoodAlternateNamesDestructured = Array<FoodAlternateNamesItem>;
export type FoodAlternateNamesSnapshot = Array<FoodAlternateNamesItemSnapshot>;
export type FoodAlternateNamesItem = string;
export type FoodAlternateNamesItemInit = FoodAlternateNamesItem;
export type FoodAlternateNamesItemSnapshot = FoodAlternateNamesItem;
export type FoodAlternateNamesItemDestructured = FoodAlternateNamesItem;
export type FoodCategoryId = string | null;
export type FoodCategoryIdInit = FoodCategoryId | undefined;
export type FoodCategoryIdSnapshot = FoodCategoryId;
export type FoodCategoryIdDestructured = FoodCategoryId;
export type FoodExpiresAfterDays = number | null;
export type FoodExpiresAfterDaysInit = FoodExpiresAfterDays | undefined;
export type FoodExpiresAfterDaysSnapshot = FoodExpiresAfterDays;
export type FoodExpiresAfterDaysDestructured = FoodExpiresAfterDays;
export type FoodLastPurchasedAt = number | null;
export type FoodLastPurchasedAtInit = FoodLastPurchasedAt | undefined;
export type FoodLastPurchasedAtSnapshot = FoodLastPurchasedAt;
export type FoodLastPurchasedAtDestructured = FoodLastPurchasedAt;
export type FoodPurchaseIntervalGuess = number | null;
export type FoodPurchaseIntervalGuessInit =
  | FoodPurchaseIntervalGuess
  | undefined;
export type FoodPurchaseIntervalGuessSnapshot = FoodPurchaseIntervalGuess;
export type FoodPurchaseIntervalGuessDestructured = FoodPurchaseIntervalGuess;
export type FoodLastAddedAt = number | null;
export type FoodLastAddedAtInit = FoodLastAddedAt | undefined;
export type FoodLastAddedAtSnapshot = FoodLastAddedAt;
export type FoodLastAddedAtDestructured = FoodLastAddedAt;
export type FoodPurchaseCount = number;
export type FoodPurchaseCountInit = FoodPurchaseCount | undefined;
export type FoodPurchaseCountSnapshot = FoodPurchaseCount;
export type FoodPurchaseCountDestructured = FoodPurchaseCount;
export type FoodDefaultListId = string | null;
export type FoodDefaultListIdInit = FoodDefaultListId | undefined;
export type FoodDefaultListIdSnapshot = FoodDefaultListId;
export type FoodDefaultListIdDestructured = FoodDefaultListId;
export type FoodPluralizeName = boolean;
export type FoodPluralizeNameInit = FoodPluralizeName | undefined;
export type FoodPluralizeNameSnapshot = FoodPluralizeName;
export type FoodPluralizeNameDestructured = FoodPluralizeName;

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

export type SuggestionText = string;
export type SuggestionTextInit = SuggestionText;
export type SuggestionTextSnapshot = SuggestionText;
export type SuggestionTextDestructured = SuggestionText;
export type SuggestionUsageCount = number;
export type SuggestionUsageCountInit = SuggestionUsageCount | undefined;
export type SuggestionUsageCountSnapshot = SuggestionUsageCount;
export type SuggestionUsageCountDestructured = SuggestionUsageCount;

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

export type ListId = string;
export type ListIdInit = ListId | undefined;
export type ListIdSnapshot = ListId;
export type ListIdDestructured = ListId;
export type ListName = string;
export type ListNameInit = ListName;
export type ListNameSnapshot = ListName;
export type ListNameDestructured = ListName;
export type ListColor = string;
export type ListColorInit = ListColor;
export type ListColorSnapshot = ListColor;
export type ListColorDestructured = ListColor;

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

export type CollaborationInfoId = string;
export type CollaborationInfoIdInit = CollaborationInfoId | undefined;
export type CollaborationInfoIdSnapshot = CollaborationInfoId;
export type CollaborationInfoIdDestructured = CollaborationInfoId;
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
export type CollaborationInfoMeetupCreatedAt = number;
export type CollaborationInfoMeetupCreatedAtInit =
  | CollaborationInfoMeetupCreatedAt
  | undefined;
export type CollaborationInfoMeetupCreatedAtSnapshot =
  CollaborationInfoMeetupCreatedAt;
export type CollaborationInfoMeetupCreatedAtDestructured =
  CollaborationInfoMeetupCreatedAt;
export type CollaborationInfoMeetupLocation = string;
export type CollaborationInfoMeetupLocationInit =
  CollaborationInfoMeetupLocation;
export type CollaborationInfoMeetupLocationSnapshot =
  CollaborationInfoMeetupLocation;
export type CollaborationInfoMeetupLocationDestructured =
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

export interface RecipeSuggestAfterMatchFilter {
  where: "suggestAfter";
  equals: number;
  order?: "asc" | "desc";
}

export interface RecipeSuggestAfterRangeFilter {
  where: "suggestAfter";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}

export type RecipeFilter =
  | RecipeSlugMatchFilter
  | RecipeSlugRangeFilter
  | RecipeSlugStartsWithFilter
  | RecipeUpdatedAtMatchFilter
  | RecipeUpdatedAtRangeFilter
  | RecipeTagMatchFilter
  | RecipeTagRangeFilter
  | RecipeSuggestAfterMatchFilter
  | RecipeSuggestAfterRangeFilter;

export type RecipeDestructured = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prelude: any;
  note: string | null;
  ingredients: RecipeIngredients;
  instructions: any;
  url: string | null;
  session: RecipeSession | null;
  tags: RecipeTags;
  mainImage: RecipeMainImage | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
};
export type RecipeInit = {
  id?: string;
  slug?: string;
  multiplier?: number;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  prelude?: any;
  note?: string | null;
  ingredients?: RecipeIngredientsInit;
  instructions?: any;
  url?: string | null;
  session?: RecipeSessionInit | null;
  tags?: RecipeTagsInit;
  mainImage?: RecipeMainImageInit | null;
  cookCount?: number;
  lastCookedAt?: number | null;
  lastAddedAt?: number | null;
  addIntervalGuess?: number | null;
};
export type RecipeSnapshot = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prelude: any;
  note: string | null;
  ingredients: RecipeIngredientsSnapshot;
  instructions: any;
  url: string | null;
  session: RecipeSessionSnapshot | null;
  tags: RecipeTagsSnapshot;
  mainImage: RecipeMainImageSnapshot | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
};
/** Recipe sub-object types */

export type RecipeId = string;
export type RecipeIdInit = RecipeId | undefined;
export type RecipeIdSnapshot = RecipeId;
export type RecipeIdDestructured = RecipeId;
export type RecipeSlug = string;
export type RecipeSlugInit = RecipeSlug | undefined;
export type RecipeSlugSnapshot = RecipeSlug;
export type RecipeSlugDestructured = RecipeSlug;
export type RecipeMultiplier = number;
export type RecipeMultiplierInit = RecipeMultiplier | undefined;
export type RecipeMultiplierSnapshot = RecipeMultiplier;
export type RecipeMultiplierDestructured = RecipeMultiplier;
export type RecipeTitle = string;
export type RecipeTitleInit = RecipeTitle | undefined;
export type RecipeTitleSnapshot = RecipeTitle;
export type RecipeTitleDestructured = RecipeTitle;
export type RecipeCreatedAt = number;
export type RecipeCreatedAtInit = RecipeCreatedAt | undefined;
export type RecipeCreatedAtSnapshot = RecipeCreatedAt;
export type RecipeCreatedAtDestructured = RecipeCreatedAt;
export type RecipeUpdatedAt = number;
export type RecipeUpdatedAtInit = RecipeUpdatedAt | undefined;
export type RecipeUpdatedAtSnapshot = RecipeUpdatedAt;
export type RecipeUpdatedAtDestructured = RecipeUpdatedAt;
export type RecipePrelude = any;
export type RecipePreludeInit = RecipePrelude | undefined;
export type RecipePreludeSnapshot = RecipePrelude;
export type RecipePreludeDestructured = RecipePrelude;
export type RecipeNote = string | null;
export type RecipeNoteInit = RecipeNote | undefined;
export type RecipeNoteSnapshot = RecipeNote;
export type RecipeNoteDestructured = RecipeNote;
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
  food?: string | null;
  quantity?: number;
  comments?: RecipeIngredientsItemCommentsInit;
  note?: string | null;
  isSectionHeader?: boolean;
};
export type RecipeIngredientsItemDestructured = {
  id: string;
  text: string;
  unit: string | null;
  food: string | null;
  quantity: number;
  comments: RecipeIngredientsItemComments;
  note: string | null;
  isSectionHeader: boolean;
};
export type RecipeIngredientsItemSnapshot = {
  id: string;
  text: string;
  unit: string | null;
  food: string | null;
  quantity: number;
  comments: RecipeIngredientsItemCommentsSnapshot;
  note: string | null;
  isSectionHeader: boolean;
};
export type RecipeIngredientsItemId = string;
export type RecipeIngredientsItemIdInit = RecipeIngredientsItemId | undefined;
export type RecipeIngredientsItemIdSnapshot = RecipeIngredientsItemId;
export type RecipeIngredientsItemIdDestructured = RecipeIngredientsItemId;
export type RecipeIngredientsItemText = string;
export type RecipeIngredientsItemTextInit = RecipeIngredientsItemText;
export type RecipeIngredientsItemTextSnapshot = RecipeIngredientsItemText;
export type RecipeIngredientsItemTextDestructured = RecipeIngredientsItemText;
export type RecipeIngredientsItemUnit = string | null;
export type RecipeIngredientsItemUnitInit =
  | RecipeIngredientsItemUnit
  | undefined;
export type RecipeIngredientsItemUnitSnapshot = RecipeIngredientsItemUnit;
export type RecipeIngredientsItemUnitDestructured = RecipeIngredientsItemUnit;
export type RecipeIngredientsItemFood = string | null;
export type RecipeIngredientsItemFoodInit =
  | RecipeIngredientsItemFood
  | undefined;
export type RecipeIngredientsItemFoodSnapshot = RecipeIngredientsItemFood;
export type RecipeIngredientsItemFoodDestructured = RecipeIngredientsItemFood;
export type RecipeIngredientsItemQuantity = number;
export type RecipeIngredientsItemQuantityInit =
  | RecipeIngredientsItemQuantity
  | undefined;
export type RecipeIngredientsItemQuantitySnapshot =
  RecipeIngredientsItemQuantity;
export type RecipeIngredientsItemQuantityDestructured =
  RecipeIngredientsItemQuantity;
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
export type RecipeIngredientsItemCommentsItem = string;
export type RecipeIngredientsItemCommentsItemInit =
  RecipeIngredientsItemCommentsItem;
export type RecipeIngredientsItemCommentsItemSnapshot =
  RecipeIngredientsItemCommentsItem;
export type RecipeIngredientsItemCommentsItemDestructured =
  RecipeIngredientsItemCommentsItem;
export type RecipeIngredientsItemNote = string | null;
export type RecipeIngredientsItemNoteInit =
  | RecipeIngredientsItemNote
  | undefined;
export type RecipeIngredientsItemNoteSnapshot = RecipeIngredientsItemNote;
export type RecipeIngredientsItemNoteDestructured = RecipeIngredientsItemNote;
export type RecipeIngredientsItemIsSectionHeader = boolean;
export type RecipeIngredientsItemIsSectionHeaderInit =
  | RecipeIngredientsItemIsSectionHeader
  | undefined;
export type RecipeIngredientsItemIsSectionHeaderSnapshot =
  RecipeIngredientsItemIsSectionHeader;
export type RecipeIngredientsItemIsSectionHeaderDestructured =
  RecipeIngredientsItemIsSectionHeader;

export type RecipeInstructions = any;
export type RecipeInstructionsInit = RecipeInstructions | undefined;
export type RecipeInstructionsSnapshot = RecipeInstructions;
export type RecipeInstructionsDestructured = RecipeInstructions;
export type RecipeUrl = string | null;
export type RecipeUrlInit = RecipeUrl | undefined;
export type RecipeUrlSnapshot = RecipeUrl;
export type RecipeUrlDestructured = RecipeUrl;
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
export type RecipeSessionStartedAt = number;
export type RecipeSessionStartedAtInit = RecipeSessionStartedAt | undefined;
export type RecipeSessionStartedAtSnapshot = RecipeSessionStartedAt;
export type RecipeSessionStartedAtDestructured = RecipeSessionStartedAt;
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
export type RecipeSessionCompletedInstructionsItem = string;
export type RecipeSessionCompletedInstructionsItemInit =
  RecipeSessionCompletedInstructionsItem;
export type RecipeSessionCompletedInstructionsItemSnapshot =
  RecipeSessionCompletedInstructionsItem;
export type RecipeSessionCompletedInstructionsItemDestructured =
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
export type RecipeSessionCompletedIngredientsItem = string;
export type RecipeSessionCompletedIngredientsItemInit =
  RecipeSessionCompletedIngredientsItem;
export type RecipeSessionCompletedIngredientsItemSnapshot =
  RecipeSessionCompletedIngredientsItem;
export type RecipeSessionCompletedIngredientsItemDestructured =
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
export type RecipeSessionInstructionAssignmentsValue = string;
export type RecipeSessionInstructionAssignmentsValueInit =
  RecipeSessionInstructionAssignmentsValue;
export type RecipeSessionInstructionAssignmentsValueSnapshot =
  RecipeSessionInstructionAssignmentsValue;
export type RecipeSessionInstructionAssignmentsValueDestructured =
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
export type RecipeSessionIngredientAssignmentsValue = string;
export type RecipeSessionIngredientAssignmentsValueInit =
  RecipeSessionIngredientAssignmentsValue;
export type RecipeSessionIngredientAssignmentsValueSnapshot =
  RecipeSessionIngredientAssignmentsValue;
export type RecipeSessionIngredientAssignmentsValueDestructured =
  RecipeSessionIngredientAssignmentsValue;

export type RecipeTags = ListEntity<RecipeTagsInit, RecipeTagsDestructured>;
export type RecipeTagsInit = Array<RecipeTagsItemInit>;
export type RecipeTagsDestructured = Array<RecipeTagsItem>;
export type RecipeTagsSnapshot = Array<RecipeTagsItemSnapshot>;
export type RecipeTagsItem = string;
export type RecipeTagsItemInit = RecipeTagsItem;
export type RecipeTagsItemSnapshot = RecipeTagsItem;
export type RecipeTagsItemDestructured = RecipeTagsItem;
export type RecipeMainImage = EntityFile;
export type RecipeMainImageInit = File;
export type RecipeMainImageDestructured = EntityFile;
export type RecipeMainImageSnapshot = string;
export type RecipeCookCount = number;
export type RecipeCookCountInit = RecipeCookCount | undefined;
export type RecipeCookCountSnapshot = RecipeCookCount;
export type RecipeCookCountDestructured = RecipeCookCount;
export type RecipeLastCookedAt = number | null;
export type RecipeLastCookedAtInit = RecipeLastCookedAt | undefined;
export type RecipeLastCookedAtSnapshot = RecipeLastCookedAt;
export type RecipeLastCookedAtDestructured = RecipeLastCookedAt;
export type RecipeLastAddedAt = number | null;
export type RecipeLastAddedAtInit = RecipeLastAddedAt | undefined;
export type RecipeLastAddedAtSnapshot = RecipeLastAddedAt;
export type RecipeLastAddedAtDestructured = RecipeLastAddedAt;
export type RecipeAddIntervalGuess = number | null;
export type RecipeAddIntervalGuessInit = RecipeAddIntervalGuess | undefined;
export type RecipeAddIntervalGuessSnapshot = RecipeAddIntervalGuess;
export type RecipeAddIntervalGuessDestructured = RecipeAddIntervalGuess;

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

export type RecipeTagMetadataName = string;
export type RecipeTagMetadataNameInit = RecipeTagMetadataName;
export type RecipeTagMetadataNameSnapshot = RecipeTagMetadataName;
export type RecipeTagMetadataNameDestructured = RecipeTagMetadataName;
export type RecipeTagMetadataColor = string | null;
export type RecipeTagMetadataColorInit = RecipeTagMetadataColor | undefined;
export type RecipeTagMetadataColorSnapshot = RecipeTagMetadataColor;
export type RecipeTagMetadataColorDestructured = RecipeTagMetadataColor;
export type RecipeTagMetadataIcon = string | null;
export type RecipeTagMetadataIconInit = RecipeTagMetadataIcon | undefined;
export type RecipeTagMetadataIconSnapshot = RecipeTagMetadataIcon;
export type RecipeTagMetadataIconDestructured = RecipeTagMetadataIcon;
