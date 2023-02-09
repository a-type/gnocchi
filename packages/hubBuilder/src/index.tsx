import { PublishedRecipe } from '@aglio/prisma';
import { renderToPipeableStream } from 'react-dom/server';
import { Page } from './template/Page.jsx';

/**
 * Renders an HTML stream of a recipe page.
 */
export async function buildRecipePage(
	recipe: PublishedRecipe,
	onError: (error: Error) => void,
) {
	return renderToPipeableStream(<Page recipe={recipe} />, {
		bootstrapScripts: [],
		onError: onError as any,
	});
}
