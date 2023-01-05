import { Context, ComponentType, ReactNode } from "react";
import type {
  Client,
  ClientDescriptor,
  Schema,
  Recipe,
  RecipeFilter,
  Collection,
  CollectionFilter,
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

  useCollection(id: string): Collection;
  useCollection(id: string, config: { skip: boolean }): Collection | null;
  useOneCollection: <
    Config extends SkippableFilterConfig<CollectionFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Collection, Config>;
  useAllCollections: <
    Config extends SkippableFilterConfig<CollectionFilter> = { index: any }
  >(
    config?: Config
  ) => NullIfSkip<Collection[], Config>;
}

export function createHooks<Presence = any, Profile = any>(): GeneratedHooks<
  Presence,
  Profile
>;
