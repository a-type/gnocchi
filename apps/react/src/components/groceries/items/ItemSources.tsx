import React, { ComponentPropsWithoutRef } from 'react';
import { Item, hooks } from '@/stores/groceries/index.js';
import { styled } from '@/stitches.config.js';
import { ObjectEntity } from '@lo-fi/web';

export interface ItemSourcesProps
	extends ComponentPropsWithoutRef<typeof ItemSourcesRoot> {
	item: Item;
}

export function ItemSources({ item, ...rest }: ItemSourcesProps) {
	hooks.useWatch(item.get('inputs'));
	return (
		<ItemSourcesRoot {...rest}>
			{item.get('inputs').map((input) => (
				<Li key={input.oid}>
					<InputRenderer input={input} />
				</Li>
			))}
		</ItemSourcesRoot>
	);
}

function InputRenderer({
	input,
}: {
	input: ObjectEntity<{
		text: string;
		url: string | null;
		title: string | null;
	}>;
}) {
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

const ItemSourcesRoot = styled('ul', {
	listStyle: 'none',
	padding: 0,
	margin: 0,
	fontSize: '$xs',
	color: '$gray70',
});

const Li = styled('li', {
	color: 'inherit',
	fontSize: 'inherit',
	display: 'inline',

	'&:not(:last-child)::after': {
		content: '", "',
	},
});
