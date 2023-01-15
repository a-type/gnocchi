import { ItemInputsItem, Item } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import * as classes from './ItemSources.css.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
	H2,
	H3,
	P,
	Span,
	TextLink,
	TextLocalLink,
} from '@/components/primitives/index.js';
import { fractionToText } from '@aglio/tools';
import { IngredientText } from '@/components/recipes/viewer/IngredientText.jsx';
import { Link } from 'react-router-dom';
import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { Suspense } from 'react';

export interface ItemSourcesProps {
	item: Item;
}

export function ItemSources({ item, ...rest }: ItemSourcesProps) {
	hooks.useWatch(item.get('inputs'));
	return (
		<div className={classes.root} {...rest}>
			<label className={classes.label}>Sources</label>
			<ul className={classes.list} {...rest}>
				{item.get('inputs').map((input) => (
					<li className={classes.item} key={(input as any).oid}>
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
				className={classes.link}
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
				<TextLink href="#">{title ? truncate(title) : 'a recipe'}</TextLink>
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
			<TextLocalLink
				className={sprinkles({ mb: 3 })}
				to={makeRecipeLink(recipe)}
			>
				View recipe
			</TextLocalLink>
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
