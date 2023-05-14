import { ItemInputsItem, Item } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import { fractionToText } from '@aglio/tools';
import { IngredientText } from '@/components/recipes/viewer/IngredientText.jsx';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { Suspense } from 'react';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { TextLink } from '@/components/nav/Link.jsx';
import { Button } from '@aglio/ui/components/button';
import { Box } from '@aglio/ui/components/box';
import { H2, H3, P } from '@aglio/ui/components/typography';
import { sprinkles } from '@aglio/ui/styles';

export interface ItemSourcesProps {
	item: Item;
}

export function ItemSources({ item, ...rest }: ItemSourcesProps) {
	hooks.useWatch(item.get('inputs'));
	return (
		<div className="mr-auto mt-2 mb-0 text-xs min-w-0" {...rest}>
			<label className="italic inline mr-2">Sources:</label>
			<ul
				className="color-gray7 list-none p-0 m-0 max-w-full overflow-hidden inline-flex flex-col"
				{...rest}
			>
				{item.get('inputs').map((input) => (
					<li
						className="color-inherit text-inherit inline text-ellipsis max-w-full after:[&:not(:last-child)]:content-[',_']"
						key={(input as any).oid}
					>
						<InputRenderer input={input} />
					</li>
				))}
			</ul>
		</div>
	);
}

function InputRenderer({ input }: { input: ItemInputsItem }) {
	const { url, recipeId, multiplier, title, text } = hooks.useWatch(input);
	if (recipeId) {
		return (
			<span>
				{text}
				{multiplier !== 1 ? ` (x${multiplier})` : ''} (from{' '}
				<RecipePreview
					recipeId={recipeId}
					title={title}
					multiplier={multiplier}
				/>
				)
			</span>
		);
	}
	if (url) {
		return (
			<a
				href={url}
				className="font-bold"
				rel="noopener noreferrer"
				target="_blank"
			>
				{title || 'A website'}
			</a>
		);
	}
	if (title) {
		return <span>{truncate(title)}</span>;
	}
	return <span>Added "{text}"</span>;
}

function truncate(str: string, max = 20) {
	if (str.length > max) {
		return str.slice(0, max) + '…';
	}
	return str;
}

function RecipePreview({
	recipeId,
	title,
	multiplier,
}: {
	recipeId: string;
	title?: string | null;
	multiplier?: number | null;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<TextLink role="button" to="#">
					{title ? truncate(title) : 'a recipe'}
				</TextLink>
			</DialogTrigger>
			<DialogContent>
				<Suspense>
					<RecipePreviewContent
						recipeId={recipeId}
						multiplier={multiplier || undefined}
					/>
				</Suspense>
				<DialogActions>
					<DialogClose asChild>
						<Button align="end">Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function RecipePreviewContent({
	recipeId,
	multiplier = 1,
}: {
	recipeId: string;
	multiplier?: number;
}) {
	const recipe = hooks.useRecipe(recipeId);
	const live = hooks.useWatch(recipe);

	if (!live || !recipe) {
		return (
			<Box>
				<H2>Recipe not found</H2>
				<P>It may have been deleted.</P>
			</Box>
		);
	}

	const { title, ingredients } = live;

	return (
		<Box>
			<H2 gutterBottom={false}>{title}</H2>
			<TextLink className={sprinkles({ mb: 3 })} to={makeRecipeLink(recipe)}>
				View recipe
			</TextLink>
			<H3>Ingredients</H3>
			{multiplier !== 1 && (
				<span>(with {fractionToText(multiplier)} multiplication applied)</span>
			)}
			<ul>
				{ingredients.map((ingredient) => (
					<li key={ingredient.get('id')}>
						<IngredientText ingredient={ingredient} multiplier={multiplier} />
					</li>
				))}
			</ul>
		</Box>
	);
}
