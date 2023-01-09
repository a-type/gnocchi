import { Recipe } from '@aglio/groceries-client';

export function makeRecipeLink(
	recipe: Recipe,
	path: '' | '/edit' | '/cook' = '',
) {
	return `/recipes/${sanitizeForUrl(
		recipe.get('title') || 'recipe',
	)}-${recipe.get('slug')}${path}`;
}

function sanitizeForUrl(text: string) {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 50);
}
