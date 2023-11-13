import { StorageSchema } from '@verdant-web/common';
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
	expiredAt: number | null;
	listId: string | null;
	comment: string | null;
};

export type ItemInputsItemSnapshot = {
	text: string;
	url: string | null;
	title: string | null;
	multiplier: number | null;
	recipeId: string | null;
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
	expiredAt?: number | null;
	listId?: string | null;
	comment?: string | null;
};

export type ItemInputsItemInit = {
	text: string;
	url?: string | null;
	title?: string | null;
	multiplier?: number | null;
	recipeId?: string | null;
};
export type ItemInputsInit = ItemInputsItemInit[];

export type FoodCategoryAssignmentSnapshot = {
	id: string;
	foodName: string;
	categoryId: string;
	remote: boolean;
};
export type FoodCategoryAssignmentInit = {
	id?: string;
	foodName: string;
	categoryId: string;
	remote: boolean;
};

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
	ingredients: RecipeIngredientsSnapshot;
	instructions: any | null;
	url: string | null;
	session: RecipeSessionSnapshot;
	tags: RecipeTagsSnapshot;
	mainImage: string | null;
};

export type RecipeIngredientsItemCommentsSnapshot = string[];
export type RecipeIngredientsItemSnapshot = {
	id: string;
	text: string;
	unit: string | null;
	food: string;
	quantity: number;
	comments: RecipeIngredientsItemCommentsSnapshot;
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
	ingredients?: RecipeIngredientsInit;
	instructions?: any | null;
	url?: string | null;
	session?: RecipeSessionInit;
	tags?: RecipeTagsInit;
	mainImage?: File | null;
};

export type RecipeIngredientsItemCommentsInit = string[];
export type RecipeIngredientsItemInit = {
	id?: string;
	text: string;
	unit?: string | null;
	food: string;
	quantity?: number;
	comments?: RecipeIngredientsItemCommentsInit;
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
	categories: { init: CategoryInit; snapshot: CategorySnapshot };
	items: { init: ItemInit; snapshot: ItemSnapshot };
	foodCategoryAssignments: {
		init: FoodCategoryAssignmentInit;
		snapshot: FoodCategoryAssignmentSnapshot;
	};
	suggestions: { init: SuggestionInit; snapshot: SuggestionSnapshot };
	lists: { init: ListInit; snapshot: ListSnapshot };
	collaborationInfo: {
		init: CollaborationInfoInit;
		snapshot: CollaborationInfoSnapshot;
	};
	recipes: { init: RecipeInit; snapshot: RecipeSnapshot };
	recipeTagMetadata: {
		init: RecipeTagMetadataInit;
		snapshot: RecipeTagMetadataSnapshot;
	};
};
