import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type CategorySnapshot = { id: string; name: string };
export type CategoryInit = { id?: string; name: string };

export type ItemSnapshot = {
  id: string;
  categoryId: string;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs: ItemInputsSnapshot;
};

export type ItemInputsItemSnapshot = {
  text: string;
  url: string | null;
  title: string | null;
};
export type ItemInputsSnapshot = ItemInputsItemSnapshot[];
export type ItemInit = {
  id?: string;
  categoryId: string;
  createdAt?: number;
  totalQuantity: number;
  purchasedQuantity?: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs?: ItemInputsInit;
};

export type ItemInputsItemInit = {
  text: string;
  url?: string | null;
  title?: string | null;
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

export type MigrationTypes = {
  category: { init: CategoryInit; snapshot: CategorySnapshot };
  item: { init: ItemInit; snapshot: ItemSnapshot };
  foodCategoryAssignment: {
    init: FoodCategoryAssignmentInit;
    snapshot: FoodCategoryAssignmentSnapshot;
  };
};
