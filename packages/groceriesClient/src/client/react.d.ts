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
  Recipe,
  RecipeFilter,
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

type NullIfSkip<V, C> = C extends { skip: boolean } ? V | null : V;
type SkippableFilterConfig<F> =
  | {
      index: F;
    }
  | {
      index: F;
      skip: boolean;
    };

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
  useUnsuspendedClient: () => Client<Presence, Profile> | null;
  useSelf: () => UserInfo<Profile, Presence>;
  usePeerIds: () => string[];
  usePeer: (peerId: string | null) => UserInfo<Profile, Presence> | null;
  useFindPeer: (
    query: (peer: UserInfo<Profile, Presence>) => boolean,
    options?: { includeSelf: boolean }
  ) => UserInfo<Profile, Presence> | null;
  useFindPeers: (
    query: (peer: UserInfo<Profile, Presence>) => boolean,
    options?: { includeSelf: boolean }
  ) => UserInfo<Profile, Presence>[];
  useSyncStatus: () => boolean;
  useWatch<T extends AnyEntity<any, any, any> | null>(
    entity: T
  ): EntityDestructured<T>;
  useWatch<
    T extends AnyEntity<any, any, any> | null,
    P extends keyof EntityShape<T>
  >(
    entity: T,
    prop: P
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

  useCategory(id: string): Category;
  useCategory(id: string, config: { skip: boolean }): Category | null;
  useOneCategory: <
    Config extends SkippableFilterConfig<CategoryFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Category, Config>;
  useAllCategories: <
    Config extends SkippableFilterConfig<CategoryFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Category[], Config>;

  useItem(id: string): Item;
  useItem(id: string, config: { skip: boolean }): Item | null;
  useOneItem: <
    Config extends SkippableFilterConfig<ItemFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Item, Config>;
  useAllItems: <
    Config extends SkippableFilterConfig<ItemFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Item[], Config>;

  useFoodCategoryAssignment(id: string): FoodCategoryAssignment;
  useFoodCategoryAssignment(
    id: string,
    config: { skip: boolean }
  ): FoodCategoryAssignment | null;
  useOneFoodCategoryAssignment: <
    Config extends SkippableFilterConfig<FoodCategoryAssignmentFilter> = {
      index: any;
    }
  >(
    config?: Config
  ) => NullIfSkip<FoodCategoryAssignment, Config>;
  useAllFoodCategoryAssignments: <
    Config extends SkippableFilterConfig<FoodCategoryAssignmentFilter> = {
      index: any;
    }
  >(
    config?: Config
  ) => NullIfSkip<FoodCategoryAssignment[], Config>;

  useSuggestion(id: string): Suggestion;
  useSuggestion(id: string, config: { skip: boolean }): Suggestion | null;
  useOneSuggestion: <
    Config extends SkippableFilterConfig<SuggestionFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Suggestion, Config>;
  useAllSuggestions: <
    Config extends SkippableFilterConfig<SuggestionFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Suggestion[], Config>;

  useList(id: string): List;
  useList(id: string, config: { skip: boolean }): List | null;
  useOneList: <
    Config extends SkippableFilterConfig<ListFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<List, Config>;
  useAllLists: <
    Config extends SkippableFilterConfig<ListFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<List[], Config>;

  useCollaborationInfo(id: string): CollaborationInfo;
  useCollaborationInfo(
    id: string,
    config: { skip: boolean }
  ): CollaborationInfo | null;
  useOneCollaborationInfo: <
    Config extends SkippableFilterConfig<CollaborationInfoFilter> = {
      index: any;
    }
  >(
    config?: Config
  ) => NullIfSkip<CollaborationInfo, Config>;
  useAllCollaborationInfo: <
    Config extends SkippableFilterConfig<CollaborationInfoFilter> = {
      index: any;
    }
  >(
    config?: Config
  ) => NullIfSkip<CollaborationInfo[], Config>;

  useRecipe(id: string): Recipe;
  useRecipe(id: string, config: { skip: boolean }): Recipe | null;
  useOneRecipe: <
    Config extends SkippableFilterConfig<RecipeFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Recipe, Config>;
  useAllRecipes: <
    Config extends SkippableFilterConfig<RecipeFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Recipe[], Config>;
}

export function createHooks<Presence = any, Profile = any>(): GeneratedHooks<
  Presence,
  Profile
>;
