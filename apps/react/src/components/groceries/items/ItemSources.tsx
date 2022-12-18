import { ItemInputsItem } from '@/stores/groceries/client/index.js';
import { hooks, Item } from '@/stores/groceries/index.js';
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
	if (!url && !recipeId) {
		return <span>{text}</span>;
	}
	if (recipeId) {
		return (
			<span>
				{text} ({multiplier !== 1 ? ` x${multiplier}` : ''}) (from{' '}
				<a className={classes.link} href={`/recipes/${recipeId}`}>
					{title ? truncate(title) : 'a recipe'}
				</a>
				)
			</span>
		);
	}
	return (
		<span>
			{text} (from{' '}
			<a className={classes.link} href={url!}>
				{title ? truncate(title) : 'the web'}
			</a>
			)
		</span>
	);
}

function truncate(str: string, max = 20) {
	if (str.length > max) {
		return str.slice(0, max) + '…';
	}
	return str;
}
