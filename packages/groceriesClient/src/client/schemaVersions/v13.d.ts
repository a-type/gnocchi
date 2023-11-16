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
  expiredAt: number | null;
  listId: string | null;
};

export type ItemInputsItemSnapshot = {
  text: string;
  url: string | null;
  title: string | null;
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
  expiredAt?: number | null;
  listId?: string | null;
};

export type ItemInputsItemInit = {
  text: string;
  url?: string | null;
  title?: string | null;
  quantity?: number | null;
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

export type MigrationTypes = {
  category: { init: CategoryInit; snapshot: CategorySnapshot };
  item: { init: ItemInit; snapshot: ItemSnapshot };
  foodCategoryAssignment: {
    init: FoodCategoryAssignmentInit;
    snapshot: FoodCategoryAssignmentSnapshot;
  };
  suggestion: { init: SuggestionInit; snapshot: SuggestionSnapshot };
  list: { init: ListInit; snapshot: ListSnapshot };
  collaborationInfo: {
    init: CollaborationInfoInit;
    snapshot: CollaborationInfoSnapshot;
  };
};
