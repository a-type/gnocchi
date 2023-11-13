import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

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
export type CategoryInit = {
  id?: string;
  name: string;
  sortKey?: string;
  expirationDays?: number | null;
  claim?: CategoryClaimInit;
};

export type CategoryClaimInit = { claimedBy: string; claimedAt: number } | null;

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

export type FoodAlternateNamesSnapshot = string[];
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

export type FoodAlternateNamesInit = string[];

export type SuggestionSnapshot = { text: string; usageCount: number };
export type SuggestionInit = { text: string; usageCount?: number };

export type ListSnapshot = { id: string; name: string; color: string };
export type ListInit = { id?: string; name: string; color: string };

export type CollaborationInfoSnapshot = {
  id: string;
  meetup: CollaborationInfoMeetupSnapshot;
};

export type CollaborationInfoMeetupSnapshot = {
  createdAt: number;
  location: string;
} | null;
export type CollaborationInfoInit = {
  id?: string;
  meetup?: CollaborationInfoMeetupInit;
};

export type CollaborationInfoMeetupInit = {
  createdAt?: number;
  location: string;
} | null;

export type RecipeSnapshot = {
  id: string;
  slug: string;
  multiplier: number;
  title: string;
  createdAt: number;
  updatedAt: number;
  prelude: any | null;
  note: string | null;
  ingredients: RecipeIngredientsSnapshot;
  instructions: any | null;
  url: string | null;
  session: RecipeSessionSnapshot;
  tags: RecipeTagsSnapshot;
  mainImage: string | null;
  cookCount: number;
  lastCookedAt: number | null;
  lastAddedAt: number | null;
  addIntervalGuess: number | null;
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
export type RecipeInit = {
  id?: string;
  slug?: string;
  multiplier?: number;
  title?: string;
  createdAt?: number;
  updatedAt?: number;
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

export type RecipeTagMetadataSnapshot = {
  name: string;
  color: string | null;
  icon: string | null;
};
export type RecipeTagMetadataInit = {
  name: string;
  color?: string | null;
  icon?: string | null;
};

export type MigrationTypes = {
  category: { init: CategoryInit; snapshot: CategorySnapshot };
  item: { init: ItemInit; snapshot: ItemSnapshot };
  food: { init: FoodInit; snapshot: FoodSnapshot };
  suggestion: { init: SuggestionInit; snapshot: SuggestionSnapshot };
  list: { init: ListInit; snapshot: ListSnapshot };
  collaborationInfo: {
    init: CollaborationInfoInit;
    snapshot: CollaborationInfoSnapshot;
  };
  recipe: { init: RecipeInit; snapshot: RecipeSnapshot };
  recipeTagMetadata: {
    init: RecipeTagMetadataInit;
    snapshot: RecipeTagMetadataSnapshot;
  };
};
