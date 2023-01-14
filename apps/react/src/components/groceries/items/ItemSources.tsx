import { ItemInputsItem, Item } from '@aglio/groceries-client';
import { hooks } from '@/stores/groceries/index.js';
import * as classes from './ItemSources.css.js';

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
				<a className={classes.link} href={`/recipes/${recipeId}`}>
					{title ? truncate(title) : 'a recipe'}
				</a>
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
