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
  RecipeTagMetadata,
  RecipeTagMetadataFilter,
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
  EntityFile,
} from "@lo-fi/web";

type SkippableFilterConfig<F> = {
  index: F;
  skip?: boolean;
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
  useWatch<T extends EntityFile | null>(file: T): string | null;
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

  useCategory(id: string, config?: { skip?: boolean }): Category | null;
  useOneCategory: <Config extends SkippableFilterConfig<CategoryFilter>>(
    config?: Config
  ) => Category | null;
  useAllCategories: <Config extends SkippableFilterConfig<CategoryFilter>>(
    config?: Config
  ) => Category[];

  useItem(id: string, config?: { skip?: boolean }): Item | null;
  useOneItem: <Config extends SkippableFilterConfig<ItemFilter>>(
    config?: Config
  ) => Item | null;
  useAllItems: <Config extends SkippableFilterConfig<ItemFilter>>(
    config?: Config
  ) => Item[];

  useFoodCategoryAssignment(
    id: string,
    config?: { skip?: boolean }
  ): FoodCategoryAssignment | null;
  useOneFoodCategoryAssignment: <
    Config extends SkippableFilterConfig<FoodCategoryAssignmentFilter>
  >(
    config?: Config
  ) => FoodCategoryAssignment | null;
  useAllFoodCategoryAssignments: <
    Config extends SkippableFilterConfig<FoodCategoryAssignmentFilter>
  >(
    config?: Config
  ) => FoodCategoryAssignment[];

  useSuggestion(id: string, config?: { skip?: boolean }): Suggestion | null;
  useOneSuggestion: <Config extends SkippableFilterConfig<SuggestionFilter>>(
    config?: Config
  ) => Suggestion | null;
  useAllSuggestions: <Config extends SkippableFilterConfig<SuggestionFilter>>(
    config?: Config
  ) => Suggestion[];

  useList(id: string, config?: { skip?: boolean }): List | null;
  useOneList: <Config extends SkippableFilterConfig<ListFilter>>(
    config?: Config
  ) => List | null;
  useAllLists: <Config extends SkippableFilterConfig<ListFilter>>(
    config?: Config
  ) => List[];

  useCollaborationInfo(
    id: string,
    config?: { skip?: boolean }
  ): CollaborationInfo | null;
  useOneCollaborationInfo: <
    Config extends SkippableFilterConfig<CollaborationInfoFilter>
  >(
    config?: Config
  ) => CollaborationInfo | null;
  useAllCollaborationInfo: <
    Config extends SkippableFilterConfig<CollaborationInfoFilter>
  >(
    config?: Config
  ) => CollaborationInfo[];

  useRecipe(id: string, config?: { skip?: boolean }): Recipe | null;
  useOneRecipe: <Config extends SkippableFilterConfig<RecipeFilter>>(
    config?: Config
  ) => Recipe | null;
  useAllRecipes: <Config extends SkippableFilterConfig<RecipeFilter>>(
    config?: Config
  ) => Recipe[];

  useRecipeTagMetadata(
    id: string,
    config?: { skip?: boolean }
  ): RecipeTagMetadata | null;
  useOneRecipeTagMetadata: <
    Config extends SkippableFilterConfig<RecipeTagMetadataFilter>
  >(
    config?: Config
  ) => RecipeTagMetadata | null;
  useAllRecipeTagMetadata: <
    Config extends SkippableFilterConfig<RecipeTagMetadataFilter>
  >(
    config?: Config
  ) => RecipeTagMetadata[];
}

export function createHooks<Presence = any, Profile = any>(): GeneratedHooks<
  Presence,
  Profile
>;
