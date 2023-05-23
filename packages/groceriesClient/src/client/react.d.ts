import { Context, ComponentType, ReactNode } from "react";
import type {
  Client,
  ClientDescriptor,
  Schema,
  Category,
  CategoryFilter,
  Item,
  ItemFilter,
  Food,
  FoodFilter,
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
} from "@verdant-web/store";

type SkippableFilterConfig<F> = {
  index?: F;
  skip?: boolean;
  key?: string;
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
  useUndo(): () => void;
  useRedo(): () => void;
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
  useAllCategoriesPaginated: <
    Config extends SkippableFilterConfig<CategoryFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [
    Category[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllCategoriesInfinite: <
    Config extends SkippableFilterConfig<CategoryFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [Category[], { loadMore: () => void; hasMore: boolean }];

  useItem(id: string, config?: { skip?: boolean }): Item | null;
  useOneItem: <Config extends SkippableFilterConfig<ItemFilter>>(
    config?: Config
  ) => Item | null;
  useAllItems: <Config extends SkippableFilterConfig<ItemFilter>>(
    config?: Config
  ) => Item[];
  useAllItemsPaginated: <
    Config extends SkippableFilterConfig<ItemFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [
    Item[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllItemsInfinite: <
    Config extends SkippableFilterConfig<ItemFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [Item[], { loadMore: () => void; hasMore: boolean }];

  useFood(id: string, config?: { skip?: boolean }): Food | null;
  useOneFood: <Config extends SkippableFilterConfig<FoodFilter>>(
    config?: Config
  ) => Food | null;
  useAllFoods: <Config extends SkippableFilterConfig<FoodFilter>>(
    config?: Config
  ) => Food[];
  useAllFoodsPaginated: <
    Config extends SkippableFilterConfig<FoodFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [
    Food[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllFoodsInfinite: <
    Config extends SkippableFilterConfig<FoodFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [Food[], { loadMore: () => void; hasMore: boolean }];

  useList(id: string, config?: { skip?: boolean }): List | null;
  useOneList: <Config extends SkippableFilterConfig<ListFilter>>(
    config?: Config
  ) => List | null;
  useAllLists: <Config extends SkippableFilterConfig<ListFilter>>(
    config?: Config
  ) => List[];
  useAllListsPaginated: <
    Config extends SkippableFilterConfig<ListFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [
    List[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllListsInfinite: <
    Config extends SkippableFilterConfig<ListFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [List[], { loadMore: () => void; hasMore: boolean }];

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
  useAllCollaborationInfoPaginated: <
    Config extends SkippableFilterConfig<CollaborationInfoFilter> & {
      pageSize?: number;
    }
  >(
    config?: Config
  ) => [
    CollaborationInfo[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllCollaborationInfoInfinite: <
    Config extends SkippableFilterConfig<CollaborationInfoFilter> & {
      pageSize?: number;
    }
  >(
    config?: Config
  ) => [CollaborationInfo[], { loadMore: () => void; hasMore: boolean }];

  useRecipe(id: string, config?: { skip?: boolean }): Recipe | null;
  useOneRecipe: <Config extends SkippableFilterConfig<RecipeFilter>>(
    config?: Config
  ) => Recipe | null;
  useAllRecipes: <Config extends SkippableFilterConfig<RecipeFilter>>(
    config?: Config
  ) => Recipe[];
  useAllRecipesPaginated: <
    Config extends SkippableFilterConfig<RecipeFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [
    Recipe[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllRecipesInfinite: <
    Config extends SkippableFilterConfig<RecipeFilter> & { pageSize?: number }
  >(
    config?: Config
  ) => [Recipe[], { loadMore: () => void; hasMore: boolean }];

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
  useAllRecipeTagMetadataPaginated: <
    Config extends SkippableFilterConfig<RecipeTagMetadataFilter> & {
      pageSize?: number;
    }
  >(
    config?: Config
  ) => [
    RecipeTagMetadata[],
    {
      next: () => void;
      previous: () => void;
      setPage: (page: number) => void;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ];
  useAllRecipeTagMetadataInfinite: <
    Config extends SkippableFilterConfig<RecipeTagMetadataFilter> & {
      pageSize?: number;
    }
  >(
    config?: Config
  ) => [RecipeTagMetadata[], { loadMore: () => void; hasMore: boolean }];
}

type HookName = `use${string}`;
type HookWithoutClient<
  Hook extends <TArgs extends any[], TRet>(
    client: Client,
    ...args: Targs
  ) => TRet
> = (...args: TArgs) => TRet;
export function createHooks<
  Presence = any,
  Profile = any,
  Mutations extends {
    [N: HookName]: (client: Client, ...args: any[]) => any;
  } = never
>(
  mutations?: Mutations
): GeneratedHooks<Presence, Profile> & {
  withMutations: <
    Mutations extends {
      [Name: HookName]: (client: Client, ...args: any[]) => unknown;
    }
  >(
    mutations: Mutations
  ) => GeneratedHooks<Presence, Profile> & {
    [MutHook in keyof Mutations]: HookWithoutClient<Mutations[MutHook]>;
  };
};
