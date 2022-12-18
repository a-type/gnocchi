import { Context, ComponentType, ReactNode } from "react";
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
  CollaborationInfo,
  CollaborationInfoFilter,
} from "./index.js";
import type {
  UserInfo,
  ObjectEntity,
  ListEntity,
  Entity,
  AccessibleEntityProperty,
  EntityShape,
  AnyEntity,
  EntityDestructured,
} from "@lo-fi/web";

export interface GeneratedHooks<Presence, Profile> {
  /**
   * Render this context Provider at the top level of your
   * React tree to provide a Client to all hooks.
   */
  Provider: ComponentType<{
    value: ClientDescriptor<Schema>;
    children: ReactNode;
    sync?: boolean;
  }>;
  /**
   * Direct access to the React Context, if needed.
   */
  Context: Context<ClientDescriptor<Schema>>;
  /** @deprecated use useClient instead */
  useStorage: () => Client<Presence, Profile>;
  useClient: () => Client<Presence, Profile>;
  useSelf: () => UserInfo<Profile, Presence>;
  usePeerIds: () => string[];
  usePeer: (peerId: string | null) => UserInfo<Profile, Presence> | null;
  useSyncStatus: () => boolean;
  useWatch<T extends AnyEntity<any, any, any> | null>(
    entity: T
  ): EntityDestructured<T>;
  useWatch<
    T extends AnyEntity<any, any, any> | null,
    P extends AccessibleEntityProperty<EntityShape<T>>
  >(
    entity: T,
    props: P
  ): EntityDestructured<T>[P];
  useCanUndo(): boolean;
  useCanRedo(): boolean;
  /**
   * This non-blocking hook declaratively controls sync on/off state.
   * Render it anywhere in your tree and pass it a boolean to turn sync on/off.
   * Since it doesn't trigger Suspense, you can do this in, say, a top-level
   * route component.
   *
   * It must still be rendered within your Provider.
   */
  useSync(isOn: boolean): void;

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

  useCollaborationInfo: (id: string) => CollaborationInfo;
  useOneCollaborationInfo: (config: {
    index: CollaborationInfoFilter;
  }) => CollaborationInfo;
  useAllCollaborationInfo: (config?: {
    index: CollaborationInfoFilter;
  }) => CollaborationInfo[];
}

export function createHooks<Presence = any, Profile = any>(): GeneratedHooks<
  Presence,
  Profile
>;
