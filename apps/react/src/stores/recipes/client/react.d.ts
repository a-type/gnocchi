import { Provider } from "react";
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
  EntityBase,
  AccessibleEntityProperty,
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
  ): T extends EntityBase<any> ? EntityShape<T> : T;
  useWatch<
    T extends EntityBase<any> | null,
    P extends AccessibleEntityProperty<EntityShape<T>>
  >(
    entity: T,
    props: P
  ): EntityShape<T>[P];
  useCanUndo(): boolean;
  useCanRedo(): boolean;

  useRecipe: (id: string) => Recipe;
  useOneRecipe: (config: { index: RecipeFilter }) => Recipe;
  useAllRecipes: (config?: { index: RecipeFilter }) => Recipe[];

  useCollection: (id: string) => Collection;
  useOneCollection: (config: { index: CollectionFilter }) => Collection;
  useAllCollections: (config?: { index: CollectionFilter }) => Collection[];
}

export function createHooks<Presence = any, Profile = any>(): GeneratedHooks<
  Presence,
  Profile
>;
