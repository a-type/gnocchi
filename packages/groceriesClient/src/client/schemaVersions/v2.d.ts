import { StorageSchema } from "@verdant-web/common";
declare const schema: StorageSchema;
export default schema;

export type CategoriesSnapshot = { id: string; name: string };
export type CategoriesInit = { id: string; name: string };

export type FoodCategoryLookupsSnapshot = {
  foodName: string;
  categoryId: string;
};
export type FoodCategoryLookupsInit = { foodName: string; categoryId: string };

export type ItemsSnapshot = {
  id: string;
  categoryId: string;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs: ItemsInputsSnapshot;
};

export type ItemsInputsItemSnapshot = { text: string };
export type ItemsInputsSnapshot = ItemsInputsItemSnapshot[];
export type ItemsInit = {
  id: string;
  categoryId: string;
  createdAt: number;
  totalQuantity: number;
  purchasedQuantity: number;
  unit: string;
  food: string;
  sortKey: string;
  inputs?: ItemsInputsInit;
};

export type ItemsInputsItemInit = { text: string };
export type ItemsInputsInit = ItemsInputsItemInit[];

export type MigrationTypes = {
  categories: { init: CategoriesInit; snapshot: CategoriesSnapshot };
  foodCategoryLookups: {
    init: FoodCategoryLookupsInit;
    snapshot: FoodCategoryLookupsSnapshot;
  };
  items: { init: ItemsInit; snapshot: ItemsSnapshot };
};
