import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { RecipeNotFound } from '../RecipeNotFound.jsx';

const RecipeCookContext = createContext<Recipe | null>(null);

export function RecipeCookProvider({
	children,
	slug,
}: {
	children: ReactNode;
	slug: string;
}) {
	const slugPortion = slug.split('-').pop();
	const recipe = hooks.useOneRecipe({
		index: {
			where: 'slug',
			equals: slugPortion,
		},
	});

	const recipeId = recipe?.get('id') ?? null;
	const client = hooks.useClient();
	useEffect(() => {
		client.sync.presence.update({ viewingRecipeId: recipeId });
		return () => {
			client.sync.presence.update({ viewingRecipeId: null });
		};
	}, [recipeId, client]);

	if (!recipe) return <RecipeNotFound />;

	return (
		<RecipeCookContext.Provider value={recipe}>
			{children}
		</RecipeCookContext.Provider>
	);
}

export function useCookingRecipe() {
	const recipe = useContext(RecipeCookContext);
	if (!recipe) throw new Error('No recipe provider found');
	return recipe;
}
