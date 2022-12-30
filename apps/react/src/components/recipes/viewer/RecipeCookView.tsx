import { useWakeLock } from '@/hooks/useWakeLock.js';
import { useRecipeFromSlugUrl } from '../hooks.js';
import { RecipeInstructionsViewer } from './RecipeInstructionsViewer.jsx';
import { clsx } from 'clsx';
import * as classes from './RecipeCookView.css.js';
import { H1 } from '@/components/primitives/index.js';

export interface RecipeCookViewProps {
	slug: string;
	className?: string;
}

export function RecipeCookView({ slug, className }: RecipeCookViewProps) {
	const recipe = useRecipeFromSlugUrl(slug);

	useWakeLock(true);

	return (
		<div className={clsx(classes.container, className)}>
			<H1 gutterBottom>{recipe.get('title')}</H1>
			<RecipeInstructionsViewer recipe={recipe} />
		</div>
	);
}
