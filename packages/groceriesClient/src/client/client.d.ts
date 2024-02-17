/** Generated types for Verdant client */
import type {
  Client as BaseClient,
  ClientDescriptor as BaseClientDescriptor,
  ClientDescriptorOptions as BaseClientDescriptorOptions,
  CollectionQueries,
  StorageSchema,
  Migration,
} from "@verdant-web/store";
export * from "@verdant-web/store";

export class Client<Presence = any, Profile = any> {
  readonly categories: CollectionQueries<
    Category,
    CategoryInit,
    CategoryFilter
  >;
  readonly items: CollectionQueries<Item, ItemInit, ItemFilter>;
  readonly foods: CollectionQueries<Food, FoodInit, FoodFilter>;
  readonly lists: CollectionQueries<List, ListInit, ListFilter>;
  readonly collaborationInfo: CollectionQueries<
    CollaborationInfo,
    CollaborationInfoInit,
    CollaborationInfoFilter
  >;
  readonly recipes: CollectionQueries<Recipe, RecipeInit, RecipeFilter>;
  readonly recipeTagMetadata: CollectionQueries<
    RecipeTagMetadata,
    RecipeTagMetadataInit,
    RecipeTagMetadataFilter
  >;

  sync: BaseClient<Presence, Profile>["sync"];
  undoHistory: BaseClient<Presence, Profile>["undoHistory"];
  namespace: BaseClient<Presence, Profile>["namespace"];
  entities: BaseClient<Presence, Profile>["entities"];
  // queryStore: BaseClient<Presence, Profile>['queryStore'];
  batch: BaseClient<Presence, Profile>["batch"];
  // files: BaseClient<Presence, Profile>['files'];
  close: BaseClient<Presence, Profile>["close"];
  export: BaseClient<Presence, Profile>["export"];
  import: BaseClient<Presence, Profile>["import"];
  subscribe: BaseClient<Presence, Profile>["subscribe"];
  stats: BaseClient<Presence, Profile>["stats"];
  __dangerous__resetLocal: BaseClient<
    Presence,
    Profile
  >["__dangerous__resetLocal"];
}

export interface ClientDescriptorOptions<Presence = any, Profile = any>
  extends Omit<
    BaseClientDescriptorOptions<Presence, Profile>,
    "schema" | "migrations"
  > {
  /** WARNING: overriding the schema is dangerous and almost definitely not what you want. */
  schema?: StorageSchema;
  /** WARNING: overriding the migrations is dangerous and almost definitely not what you want. */
  migrations?: Migration[];
}

export class ClientDescriptor<Presence = any, Profile = any> {
  constructor(init: ClientDescriptorOptions<Presence, Profile>);
  open: () => Promise<Client<Presence, Profile>>;
  close: () => Promise<void>;
  readonly current: Client<Presence, Profile> | null;
  readonly readyPromise: Promise<Client<Presence, Profile>>;
  readonly schema: StorageSchema;
  readonly namespace: string;
  /**
   * Resets all local data for this client, including the schema and migrations.
   * If the client is not connected to sync, this causes the irretrievable loss of all data.
   * If the client is connected to sync, this will cause the client to re-sync all data from the server.
   * Use this very carefully, and only as a last resort.
   */
  __dangerous__resetLocal: () => Promise<void>;
}

import {
  ObjectEntity,
  ListEntity,
  EntityFile,
  EntityFileSnapshot,
} from "@verdant-web/store";

/** Generated types for Category */

export type Category = ObjectEntity<
  CategoryInit,
  CategoryDestructured,
  CategorySnapshot
>;
export type CategoryId = string;
export type CategoryName = string;
export type CategorySortKey = string;
export type CategoryExpirationDays = number;
export type CategoryClaim = ObjectEntity<
  CategoryClaimInit,
  CategoryClaimDestructured,
  CategoryClaimSnapshot
> | null;
export type CategoryClaimClaimedBy = string;
export type CategoryClaimClaimedAt = number;
export type CategoryInit = {
  id?: string;
  name: string;
  sortKey?: string;
  expirationDays?: number | null;
  claim?: CategoryClaimInit;
};

export type CategoryClaimInit = { claimedBy: string; claimedAt: number } | null;
export type CategoryDestructured = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaim;
};

export type CategoryClaimDestructured = {
  claimedBy: string;
  claimedAt: number;
};
export type CategorySnapshot = {
  id: string;
  name: string;
  sortKey: string;
  expirationDays: number | null;
  claim: CategoryClaimSnapshot;
};

export type CategoryClaimSnapshot = {
  claimedBy: string;
  claimedAt: number;
} | null;

/** Index filters for Category **/

export interface CategorySortKeySortFilter {
  where: "sortKey";
  order: "asc" | "desc";
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
export interface CategorySortKeyStartsWithFilter {
  where: "sortKey";
  startsWith: string;
  order?: "asc" | "desc";
}
export type CategoryFilter =
  | CategorySortKeySortFilter
  | CategorySortKeyMatchFilter
  | CategorySortKeyRangeFilter
  | CategorySortKeyStartsWithFilter;

/** Generated types for Item */

export type Item = ObjectEntity<ItemInit, ItemDestructured, ItemSnapshot>;
export type ItemId = string;
export type ItemCategoryId = string;
export type ItemCreatedAt = number;
export type ItemTotalQuantity = number;
export type ItemUnit = string;
export type ItemFood = string;
export type ItemInputs = ListEntity<
  ItemInputsInit,
  ItemInputsDestructured,
  ItemInputsSnapshot
>;
export type ItemInputsItem = ObjectEntity<
  ItemInputsItemInit,
  ItemInputsItemDestructured,
  ItemInputsItemSnapshot
>;
export type ItemInputsItemText = string;
export type ItemInputsItemUrl = string;
export type ItemInputsItemTitle = string;
export type ItemInputsItemMultiplier = number;
export type ItemInputsItemRecipeId = string;
export type ItemInputsItemQuantity = number;
export type ItemPurchasedAt = number;
export type ItemListId = string;
export type ItemComment = string;
export type ItemTextOverride = string;
export type ItemInit = {
  id?: string;
  categoryId?: string | null;
  createdAt?: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs?: ItemInputsInit;
  purchasedAt?: number | null;
  listId?: string | null;
  comment?: string | null;
  textOverride?: string | null;
};

export type ItemInputsItemInit = {
  text: string;
  url?: string | null;
  title?: string | null;
  multiplier?: number | null;
  recipeId?: string | null;
  quantity?: number | null;
};
export type ItemInputsInit = ItemInputsItemInit[];
export type ItemDestructured = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputs;
  purchasedAt: number | null;
  listId: string | null;
  comment: string | null;
  textOverride: string | null;
};

export type ItemInputsItemDestructured = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
  quantity: number | null;
};
export type ItemInputsDestructured = ItemInputsItem[];
export type ItemSnapshot = {
  id: string;
  categoryId: string | null;
  createdAt: number;
  totalQuantity: number;
  unit: string;
  food: string;
  inputs: ItemInputsSnapshot;
  purchasedAt: number | null;
  listId: string | null;
  comment: string | null;
  textOverride: string | null;
};

export type ItemInputsItemSnapshot = {
  text: string;
  url: string | null;
  title: string | null;
  multiplier: number | null;
  recipeId: string | null;
  quantity: number | null;
};
export type ItemInputsSnapshot = ItemInputsItemSnapshot[];

/** Index filters for Item **/

export interface ItemCategoryIdSortFilter {
  where: "categoryId";
  order: "asc" | "desc";
}
export interface ItemCategoryIdMatchFilter {
  where: "categoryId";
  equals: string;
  order?: "asc" | "desc";
}
export interface ItemCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface ItemCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface ItemFoodSortFilter {
  where: "food";
  order: "asc" | "desc";
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
export interface ItemPurchasedAtSortFilter {
  where: "purchasedAt";
  order: "asc" | "desc";
}
export interface ItemPurchasedAtMatchFilter {
  where: "purchasedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface ItemPurchasedAtRangeFilter {
  where: "purchasedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface ItemPurchasedSortFilter {
  where: "purchased";
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
export interface ItemListIdSortFilter {
  where: "listId";
  order: "asc" | "desc";
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
export interface ItemPurchasedFoodListIdCompoundFilter {
  where: "purchased_food_listId";
  match: {
    purchased: string;
    food?: string;
    listId?: string | null;
  };
  order?: "asc" | "desc";
}
export type ItemFilter =
  | ItemCategoryIdSortFilter
  | ItemCategoryIdMatchFilter
  | ItemCategoryIdRangeFilter
  | ItemCategoryIdStartsWithFilter
  | ItemFoodSortFilter
  | ItemFoodMatchFilter
  | ItemFoodRangeFilter
  | ItemFoodStartsWithFilter
  | ItemPurchasedAtSortFilter
  | ItemPurchasedAtMatchFilter
  | ItemPurchasedAtRangeFilter
  | ItemPurchasedSortFilter
  | ItemPurchasedMatchFilter
  | ItemPurchasedRangeFilter
  | ItemPurchasedStartsWithFilter
  | ItemListIdSortFilter
  | ItemListIdMatchFilter
  | ItemListIdRangeFilter
  | ItemListIdStartsWithFilter
  | ItemPurchasedFoodListIdCompoundFilter;

/** Generated types for Food */

export type Food = ObjectEntity<FoodInit, FoodDestructured, FoodSnapshot>;
export type FoodCanonicalName = string;
export type FoodAlternateNames = ListEntity<
  FoodAlternateNamesInit,
  FoodAlternateNamesDestructured,
  FoodAlternateNamesSnapshot
>;
export type FoodAlternateNamesItem = string;
export type FoodCategoryId = string;
export type FoodExpiresAfterDays = number;
export type FoodLastPurchasedAt = number;
export type FoodInInventory = boolean;
export type FoodExpiresAt = number;
export type FoodFrozenAt = number;
export type FoodPurchaseIntervalGuess = number;
export type FoodLastAddedAt = number;
export type FoodPurchaseCount = number;
export type FoodDefaultListId = string;
export type FoodPluralizeName = boolean;
export type FoodDoNotSuggest = boolean;
export type FoodInit = {
  canonicalName: string;
  alternateNames?: FoodAlternateNamesInit;
  categoryId?: string | null;
  expiresAfterDays?: number | null;
  lastPurchasedAt?: number | null;
  inInventory?: boolean;
  expiresAt?: number | null;
  frozenAt?: number | null;
  purchaseIntervalGuess?: number | null;
  lastAddedAt?: number | null;
  purchaseCount?: number;
  defaultListId?: string | null;
  pluralizeName?: boolean;
  doNotSuggest?: boolean;
};

export type FoodAlternateNamesInit = string[];
export type FoodDestructured = {
  canonicalName: string;
  alternateNames: FoodAlternateNames;
  categoryId: string | null;
  expiresAfterDays: number | null;
  lastPurchasedAt: number | null;
  inInventory: boolean;
  expiresAt: number | null;
  frozenAt: number | null;
  purchaseIntervalGuess: number | null;
  lastAddedAt: number | null;
  purchaseCount: number;
  defaultListId: string | null;
  pluralizeName: boolean;
  doNotSuggest: boolean;
};

export type FoodAlternateNamesDestructured = string[];
export type FoodSnapshot = {
  canonicalName: string;
  alternateNames: FoodAlternateNamesSnapshot;
  categoryId: string | null;
  expiresAfterDays: number | null;
  lastPurchasedAt: number | null;
  inInventory: boolean;
  expiresAt: number | null;
  frozenAt: number | null;
  purchaseIntervalGuess: number | null;
  lastAddedAt: number | null;
  purchaseCount: number;
  defaultListId: string | null;
  pluralizeName: boolean;
  doNotSuggest: boolean;
};

export type FoodAlternateNamesSnapshot = string[];

/** Index filters for Food **/

export interface FoodCategoryIdSortFilter {
  where: "categoryId";
  order: "asc" | "desc";
}
export interface FoodCategoryIdMatchFilter {
  where: "categoryId";
  equals: string;
  order?: "asc" | "desc";
}
export interface FoodCategoryIdRangeFilter {
  where: "categoryId";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface FoodCategoryIdStartsWithFilter {
  where: "categoryId";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface FoodNameLookupSortFilter {
  where: "nameLookup";
  order: "asc" | "desc";
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
export interface FoodNameLookupStartsWithFilter {
  where: "nameLookup";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface FoodAnyNameSortFilter {
  where: "anyName";
  order: "asc" | "desc";
}
export interface FoodAnyNameMatchFilter {
  where: "anyName";
  equals: string;
  order?: "asc" | "desc";
}
export interface FoodAnyNameRangeFilter {
  where: "anyName";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface FoodAnyNameStartsWithFilter {
  where: "anyName";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface FoodRepurchaseAfterSortFilter {
  where: "repurchaseAfter";
  order: "asc" | "desc";
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
export interface FoodPurchasedAndExpiresAtSortFilter {
  where: "purchasedAndExpiresAt";
  order: "asc" | "desc";
}
export interface FoodPurchasedAndExpiresAtMatchFilter {
  where: "purchasedAndExpiresAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface FoodPurchasedAndExpiresAtRangeFilter {
  where: "purchasedAndExpiresAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface FoodLastPurchasedAtOrZeroSortFilter {
  where: "lastPurchasedAtOrZero";
  order: "asc" | "desc";
}
export interface FoodLastPurchasedAtOrZeroMatchFilter {
  where: "lastPurchasedAtOrZero";
  equals: number;
  order?: "asc" | "desc";
}
export interface FoodLastPurchasedAtOrZeroRangeFilter {
  where: "lastPurchasedAtOrZero";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface FoodFrozenSortFilter {
  where: "frozen";
  order: "asc" | "desc";
}
export interface FoodFrozenMatchFilter {
  where: "frozen";
  equals: boolean;
  order?: "asc" | "desc";
}
export interface FoodFrozenRangeFilter {
  where: "frozen";
  gte?: boolean;
  gt?: boolean;
  lte?: boolean;
  lt?: boolean;
  order?: "asc" | "desc";
}
export interface FoodCategoryIdLastPurchasedAtCompoundFilter {
  where: "categoryId_lastPurchasedAt";
  match: {
    categoryId: string | null;
    lastPurchasedAtOrZero?: number;
  };
  order?: "asc" | "desc";
}
export interface FoodInInventoryCategoryIdLastPurchasedAtCompoundFilter {
  where: "inInventory_categoryId_lastPurchasedAt";
  match: {
    inInventory: boolean;
    categoryId?: string | null;
    lastPurchasedAtOrZero?: number;
  };
  order?: "asc" | "desc";
}
export type FoodFilter =
  | FoodCategoryIdSortFilter
  | FoodCategoryIdMatchFilter
  | FoodCategoryIdRangeFilter
  | FoodCategoryIdStartsWithFilter
  | FoodNameLookupSortFilter
  | FoodNameLookupMatchFilter
  | FoodNameLookupRangeFilter
  | FoodNameLookupStartsWithFilter
  | FoodAnyNameSortFilter
  | FoodAnyNameMatchFilter
  | FoodAnyNameRangeFilter
  | FoodAnyNameStartsWithFilter
  | FoodRepurchaseAfterSortFilter
  | FoodRepurchaseAfterMatchFilter
  | FoodRepurchaseAfterRangeFilter
  | FoodPurchasedAndExpiresAtSortFilter
  | FoodPurchasedAndExpiresAtMatchFilter
  | FoodPurchasedAndExpiresAtRangeFilter
  | FoodLastPurchasedAtOrZeroSortFilter
  | FoodLastPurchasedAtOrZeroMatchFilter
  | FoodLastPurchasedAtOrZeroRangeFilter
  | FoodFrozenSortFilter
  | FoodFrozenMatchFilter
  | FoodFrozenRangeFilter
  | FoodCategoryIdLastPurchasedAtCompoundFilter
  | FoodInInventoryCategoryIdLastPurchasedAtCompoundFilter;

/** Generated types for List */

export type List = ObjectEntity<ListInit, ListDestructured, ListSnapshot>;
export type ListId = string;
export type ListName = string;
export type ListColor = string;
export type ListInit = { id?: string; name: string; color: string };

export type ListDestructured = { id: string; name: string; color: string };

export type ListSnapshot = { id: string; name: string; color: string };

/** Index filters for List **/

export type ListFilter = never;

/** Generated types for CollaborationInfo */

export type CollaborationInfo = ObjectEntity<
  CollaborationInfoInit,
  CollaborationInfoDestructured,
  CollaborationInfoSnapshot
>;
export type CollaborationInfoId = string;
export type CollaborationInfoMeetup = ObjectEntity<
  CollaborationInfoMeetupInit,
  CollaborationInfoMeetupDestructured,
  CollaborationInfoMeetupSnapshot
> | null;
export type CollaborationInfoMeetupCreatedAt = number;
export type CollaborationInfoMeetupLocation = string;
export type CollaborationInfoInit = {
  id?: string;
  meetup?: CollaborationInfoMeetupInit;
};

export type CollaborationInfoMeetupInit = {
  createdAt?: number;
  location: string;
} | null;
export type CollaborationInfoDestructured = {
  id: string;
  meetup: CollaborationInfoMeetup;
};

export type CollaborationInfoMeetupDestructured = {
  createdAt: number;
  location: string;
};
export type CollaborationInfoSnapshot = {
  id: string;
  meetup: CollaborationInfoMeetupSnapshot;
};

export type CollaborationInfoMeetupSnapshot = {
  createdAt: number;
  location: string;
} | null;

/** Index filters for CollaborationInfo **/

export type CollaborationInfoFilter = never;

/** Generated types for Recipe */

export type Recipe = ObjectEntity<
  RecipeInit,
  RecipeDestructured,
  RecipeSnapshot
>;
export type RecipeId = string;
export type RecipeSlug = string;
export type RecipeMultiplier = number;
export type RecipeTitle = string;
export type RecipeCreatedAt = number;
export type RecipeUpdatedAt = number;
export type RecipePrepTimeMinutes = number;
export type RecipeCookTimeMinutes = number;
export type RecipeTotalTimeMinutes = number;
export type RecipeServings = number;
export type RecipePrelude = any;
export type RecipeNote = string;
export type RecipeIngredients = ListEntity<
  RecipeIngredientsInit,
  RecipeIngredientsDestructured,
  RecipeIngredientsSnapshot
>;
export type RecipeIngredientsItem = ObjectEntity<
  RecipeIngredientsItemInit,
  RecipeIngredientsItemDestructured,
  RecipeIngredientsItemSnapshot
>;
export type RecipeIngredientsItemId = string;
export type RecipeIngredientsItemText = string;
export type RecipeIngredientsItemUnit = string;
export type RecipeIngredientsItemFood = string;
export type RecipeIngredientsItemQuantity = number;
export type RecipeIngredientsItemComments = ListEntity<
  RecipeIngredientsItemCommentsInit,
  RecipeIngredientsItemCommentsDestructured,
  RecipeIngredientsItemCommentsSnapshot
>;
export type RecipeIngredientsItemCommentsItem = string;
export type RecipeIngredientsItemNote = string;
export type RecipeIngredientsItemIsSectionHeader = boolean;
export type RecipeInstructions = any;
export type RecipeUrl = string;
export type RecipeSession = ObjectEntity<
  RecipeSessionInit,
  RecipeSessionDestructured,
  RecipeSessionSnapshot
> | null;
export type RecipeSessionStartedAt = number;
export type RecipeSessionCompletedInstructions = ListEntity<
  RecipeSessionCompletedInstructionsInit,
  RecipeSessionCompletedInstructionsDestructured,
  RecipeSessionCompletedInstructionsSnapshot
>;
export type RecipeSessionCompletedInstructionsItem = string;
export type RecipeSessionCompletedIngredients = ListEntity<
  RecipeSessionCompletedIngredientsInit,
  RecipeSessionCompletedIngredientsDestructured,
  RecipeSessionCompletedIngredientsSnapshot
>;
export type RecipeSessionCompletedIngredientsItem = string;
export type RecipeSessionInstructionAssignments = ObjectEntity<
  RecipeSessionInstructionAssignmentsInit,
  RecipeSessionInstructionAssignmentsDestructured,
  RecipeSessionInstructionAssignmentsSnapshot
>;
export type RecipeSessionInstructionAssignmentsValue = string;
export type RecipeSessionIngredientAssignments = ObjectEntity<
  RecipeSessionIngredientAssignmentsInit,
  RecipeSessionIngredientAssignmentsDestructured,
  RecipeSessionIngredientAssignmentsSnapshot
>;
export type RecipeSessionIngredientAssignmentsValue = string;
export type RecipeTags = ListEntity<
  RecipeTagsInit,
  RecipeTagsDestructured,
  RecipeTagsSnapshot
>;
export type RecipeTagsItem = string;
export type RecipeMainImage = string | null;
export type RecipeCookCount = number;
export type RecipeLastCookedAt = number;
export type RecipeLastAddedAt = number;
export type RecipeAddIntervalGuess = number;
export type RecipePinnedAt = number;
export type RecipeInit = {
  id?: string;
  slug?: string;
  multiplier?: number;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
  prepTimeMinutes?: number | null;
  cookTimeMinutes?: number | null;
  totalTimeMinutes?: number | null;
  servings?: number | null;
  prelude?: any | null;
  note?: string | null;
  ingredients?: RecipeIngredientsInit;
  instructions?: any | null;
  url?: string | null;
  session?: RecipeSessionInit;
  tags?: RecipeTagsInit;
  mainImage?: File | null;
  cookCount?: number;
  lastCookedAt?: number | null;
  lastAddedAt?: number | null;
  addIntervalGuess?: number | null;
  pinnedAt?: number | null;
};

export type RecipeIngredientsItemCommentsInit = string[];
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
export type RecipeIngredientsInit = RecipeIngredientsItemInit[];
export type RecipeSessionCompletedInstructionsInit = string[];
export type RecipeSessionCompletedIngredientsInit = string[];
export type RecipeSessionInstructionAssignmentsInit = {
  [key: string]: RecipeSessionInstructionAssignmentsValueInit;
};
export type RecipeSessionIngredientAssignmentsInit = {
  [key: string]: RecipeSessionIngredientAssignmentsValueInit;
};
export type RecipeSessionInit = {
  startedAt?: number;
  completedInstructions?: RecipeSessionCompletedInstructionsInit;
  completedIngredients?: RecipeSessionCompletedIngredientsInit;
  instructionAssignments?: RecipeSessionInstructionAssignmentsInit;
  ingredientAssignments?: RecipeSessionIngredientAssignmentsInit;
} | null;
export type RecipeTagsInit = string[];
export type RecipeDestructured = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  servings: number | null;
  prelude: any | null;
  note: string | null;
  ingredients: RecipeIngredients;
  instructions: any | null;
  url: string | null;
  session: RecipeSession;
  tags: RecipeTags;
  mainImage: EntityFile | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
  pinnedAt: number | null;
};

export type RecipeIngredientsItemCommentsDestructured = string[];
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
export type RecipeIngredientsDestructured = RecipeIngredientsItem[];
export type RecipeSessionCompletedInstructionsDestructured = string[];
export type RecipeSessionCompletedIngredientsDestructured = string[];
export type RecipeSessionInstructionAssignmentsDestructured = {
  [key: string]: RecipeSessionInstructionAssignmentsValue | undefined;
};
export type RecipeSessionIngredientAssignmentsDestructured = {
  [key: string]: RecipeSessionIngredientAssignmentsValue | undefined;
};
export type RecipeSessionDestructured = {
  startedAt: number;
  completedInstructions: RecipeSessionCompletedInstructions;
  completedIngredients: RecipeSessionCompletedIngredients;
  instructionAssignments: RecipeSessionInstructionAssignments;
  ingredientAssignments: RecipeSessionIngredientAssignments;
};
export type RecipeTagsDestructured = string[];
export type RecipeSnapshot = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  servings: number | null;
  prelude: any | null;
  note: string | null;
  ingredients: RecipeIngredientsSnapshot;
  instructions: any | null;
  url: string | null;
  session: RecipeSessionSnapshot;
  tags: RecipeTagsSnapshot;
  mainImage: EntityFileSnapshot | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
  pinnedAt: number | null;
};

export type RecipeIngredientsItemCommentsSnapshot = string[];
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
export type RecipeIngredientsSnapshot = RecipeIngredientsItemSnapshot[];
export type RecipeSessionCompletedInstructionsSnapshot = string[];
export type RecipeSessionCompletedIngredientsSnapshot = string[];
export type RecipeSessionInstructionAssignmentsSnapshot = {
  [key: string]: RecipeSessionInstructionAssignmentsValueSnapshot;
};
export type RecipeSessionIngredientAssignmentsSnapshot = {
  [key: string]: RecipeSessionIngredientAssignmentsValueSnapshot;
};
export type RecipeSessionSnapshot = {
  startedAt: number;
  completedInstructions: RecipeSessionCompletedInstructionsSnapshot;
  completedIngredients: RecipeSessionCompletedIngredientsSnapshot;
  instructionAssignments: RecipeSessionInstructionAssignmentsSnapshot;
  ingredientAssignments: RecipeSessionIngredientAssignmentsSnapshot;
} | null;
export type RecipeTagsSnapshot = string[];

/** Index filters for Recipe **/

export interface RecipeSlugSortFilter {
  where: "slug";
  order: "asc" | "desc";
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
export interface RecipeUpdatedAtSortFilter {
  where: "updatedAt";
  order: "asc" | "desc";
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
export interface RecipePinnedAtSortFilter {
  where: "pinnedAt";
  order: "asc" | "desc";
}
export interface RecipePinnedAtMatchFilter {
  where: "pinnedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface RecipePinnedAtRangeFilter {
  where: "pinnedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export interface RecipeTagSortFilter {
  where: "tag";
  order: "asc" | "desc";
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
export interface RecipeTagStartsWithFilter {
  where: "tag";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeSuggestAfterSortFilter {
  where: "suggestAfter";
  order: "asc" | "desc";
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
export interface RecipeFoodSortFilter {
  where: "food";
  order: "asc" | "desc";
}
export interface RecipeFoodMatchFilter {
  where: "food";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeFoodRangeFilter {
  where: "food";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeFoodStartsWithFilter {
  where: "food";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeTitleMatchSortFilter {
  where: "titleMatch";
  order: "asc" | "desc";
}
export interface RecipeTitleMatchMatchFilter {
  where: "titleMatch";
  equals: string;
  order?: "asc" | "desc";
}
export interface RecipeTitleMatchRangeFilter {
  where: "titleMatch";
  gte?: string;
  gt?: string;
  lte?: string;
  lt?: string;
  order?: "asc" | "desc";
}
export interface RecipeTitleMatchStartsWithFilter {
  where: "titleMatch";
  startsWith: string;
  order?: "asc" | "desc";
}
export interface RecipeSessionStartedAtSortFilter {
  where: "sessionStartedAt";
  order: "asc" | "desc";
}
export interface RecipeSessionStartedAtMatchFilter {
  where: "sessionStartedAt";
  equals: number;
  order?: "asc" | "desc";
}
export interface RecipeSessionStartedAtRangeFilter {
  where: "sessionStartedAt";
  gte?: number;
  gt?: number;
  lte?: number;
  lt?: number;
  order?: "asc" | "desc";
}
export type RecipeFilter =
  | RecipeSlugSortFilter
  | RecipeSlugMatchFilter
  | RecipeSlugRangeFilter
  | RecipeSlugStartsWithFilter
  | RecipeUpdatedAtSortFilter
  | RecipeUpdatedAtMatchFilter
  | RecipeUpdatedAtRangeFilter
  | RecipePinnedAtSortFilter
  | RecipePinnedAtMatchFilter
  | RecipePinnedAtRangeFilter
  | RecipeTagSortFilter
  | RecipeTagMatchFilter
  | RecipeTagRangeFilter
  | RecipeTagStartsWithFilter
  | RecipeSuggestAfterSortFilter
  | RecipeSuggestAfterMatchFilter
  | RecipeSuggestAfterRangeFilter
  | RecipeFoodSortFilter
  | RecipeFoodMatchFilter
  | RecipeFoodRangeFilter
  | RecipeFoodStartsWithFilter
  | RecipeTitleMatchSortFilter
  | RecipeTitleMatchMatchFilter
  | RecipeTitleMatchRangeFilter
  | RecipeTitleMatchStartsWithFilter
  | RecipeSessionStartedAtSortFilter
  | RecipeSessionStartedAtMatchFilter
  | RecipeSessionStartedAtRangeFilter;

/** Generated types for RecipeTagMetadata */

export type RecipeTagMetadata = ObjectEntity<
  RecipeTagMetadataInit,
  RecipeTagMetadataDestructured,
  RecipeTagMetadataSnapshot
>;
export type RecipeTagMetadataName = string;
export type RecipeTagMetadataColor = string;
export type RecipeTagMetadataIcon = string;
export type RecipeTagMetadataInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type RecipeTagMetadataDestructured = {
  name: string;
  color: string | null;
  icon: string | null;
};

export type RecipeTagMetadataSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};

/** Index filters for RecipeTagMetadata **/

export type RecipeTagMetadataFilter = never;
