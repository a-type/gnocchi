import { Context, ComponentType, ReactNode } from 'react';
import type {
	Client,
	ClientDescriptor,
	Schema,
	Recipe,
	RecipeFilter,
	Collection,
	CollectionFilter,
} from './index.js';
import type {
	UserInfo,
	ObjectEntity,
	ListEntity,
	Entity,
	AccessibleEntityProperty,
	EntityShape,
	AnyEntity,
	EntityDestructured,
} from '@lo-fi/web';

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
		entity: T,
	): EntityDestructured<T>;
	useWatch<
		T extends AnyEntity<any, any, any> | null,
		P extends keyof EntityShape<T>,
	>(
		entity: T,
		props: P,
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
