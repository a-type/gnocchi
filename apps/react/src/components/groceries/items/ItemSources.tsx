import { ItemInputsItem } from '@/stores/groceries/client/index.js';
import { hooks, Item } from '@/stores/groceries/index.js';
import * as classes from './ItemSources.css.js';

export interface ItemSourcesProps {
	item: Item;
}

export function ItemSources({ item, ...rest }: ItemSourcesProps) {
	hooks.useWatch(item.get('inputs'));
	return (
		<ul className={classes.root} {...rest}>
			{item.get('inputs').map((input) => (
				<li className={classes.item} key={input.oid}>
					<InputRenderer input={input} />
				</li>
			))}
		</ul>
	);
}

function InputRenderer({ input }: { input: ItemInputsItem }) {
	const url = input.get('url');
	if (!url) {
		return <span>{input.get('text')}</span>;
	}
	return (
		<span>
			{input.get('text')} (from{' '}
			<a href={url}>
				{input.get('title') ? truncate(input.get('title')!) : 'the web'}
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
