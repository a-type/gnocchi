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
  DestructuredEntity,
  EntityShape,
} from "@lo-fi/web";

export interface GeneratedHooks {
  Provider: Provider<ClientDescriptor<Schema>>;
  useStorage: () => Client;
  useSelf: () => UserInfo;
  usePeerIds: () => string[];
  usePeer: (peerId: string) => UserInfo;
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

  useRecipe: (id: string) => Recipe;
  useOneRecipe: (config: { index: RecipeFilter }) => Recipe;
  useAllRecipes: (config?: { index: RecipeFilter }) => Recipe[];

  useCollection: (id: string) => Collection;
  useOneCollection: (config: { index: CollectionFilter }) => Collection;
  useAllCollections: (config?: { index: CollectionFilter }) => Collection[];
}

export const hooks: GeneratedHooks;
