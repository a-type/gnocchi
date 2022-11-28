import { Provider } from "react";
import type {
  Client,
  ClientDescriptor,
  Schema,
  Category,
  CategoryFilter,
  Item,
  ItemFilter,
  FoodCategoryAssignment,
  FoodCategoryAssignmentFilter,
  Suggestion,
  SuggestionFilter,
  List,
  ListFilter,
} from "./index.js";
import type {
  UserInfo,
  ObjectEntity,
  ListEntity,
  EntityBase,
  AccessibleEntityProperty,
  DestructuredEntity,
  EntityShape,
} from "@lo-fi/web";

export interface GeneratedHooks<Presence, Profile> {
  Provider: Provider<ClientDescriptor<Schema>>;
  /** @deprecated use useClient instead */
  useStorage: () => Client<Presence, Profile>;
  useClient: () => Client<Presence, Profile>;
  useSelf: () => UserInfo<Profile, Presence>;
  usePeerIds: () => string[];
  usePeer: (peerId: string | null) => UserInfo<Profile, Presence> | null;
  useSyncStatus: () => boolean;
  useWatch<T extends EntityBase<any> | null>(
    entity: T
  ): T extends EntityBase<any> ? DestructuredEntity<EntityShape<T>> : T;
  useWatch<
    T extends EntityBase<any> | null,
    P extends AccessibleEntityProperty<EntityShape<T>>
  >(
    entity: T,
    props: P
  ): EntityShape<T>[P];
  useCanUndo(): boolean;
  useCanRedo(): boolean;

  useCategory: (id: string) => Category;
  useOneCategory: (config: { index: CategoryFilter }) => Category;
  useAllCategories: (config?: { index: CategoryFilter }) => Category[];

  useItem: (id: string) => Item;
  useOneItem: (config: { index: ItemFilter }) => Item;
  useAllItems: (config?: { index: ItemFilter }) => Item[];

  useFoodCategoryAssignment: (id: string) => FoodCategoryAssignment;
  useOneFoodCategoryAssignment: (config: {
    index: FoodCategoryAssignmentFilter;
  }) => FoodCategoryAssignment;
  useAllFoodCategoryAssignments: (config?: {
    index: FoodCategoryAssignmentFilter;
  }) => FoodCategoryAssignment[];

  useSuggestion: (id: string) => Suggestion;
  useOneSuggestion: (config: { index: SuggestionFilter }) => Suggestion;
  useAllSuggestions: (config?: { index: SuggestionFilter }) => Suggestion[];

  useList: (id: string) => List;
  useOneList: (config: { index: ListFilter }) => List;
  useAllLists: (config?: { index: ListFilter }) => List[];
}

export function createHooks<Presence = any, Profile = any>(): GeneratedHooks<
  Presence,
  Profile
>;
