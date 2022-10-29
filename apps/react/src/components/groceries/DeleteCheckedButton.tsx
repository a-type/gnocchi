import { Box, Button, ButtonProps, Span } from '../primitives/index.js';
import React, { forwardRef, useEffect, useState } from 'react';
import { hooks, groceries } from '@/stores/groceries/index.js';
import pluralize from 'pluralize';

export interface DeleteCheckedButtonProps extends ButtonProps {}

const undoTimeout = 10000;

export const DeleteCheckedButton = forwardRef<
	HTMLButtonElement,
	DeleteCheckedButtonProps
>(function DeleteCheckedButton({ className, ...rest }, ref) {
	// TODO: if multiple lists are ever supported, this
	// will need to query based on list.
	const items = hooks.useAllItems({
		index: {
			where: 'purchased',
			equals: 'yes',
		},
	});

	const [undoCount, setUndoCount] = useState<number | false>(false);

	const deleteCompleted = async () => {
		if (items?.length) {
			await groceries.deleteItems(items.map((i) => i.get('id')));
			setUndoCount(items.length);
			setTimeout(() => {
				setUndoCount(false);
			}, undoTimeout);
		}
	};

	const undoDelete = async () => {
		await groceries.undo();
		setUndoCount(false);
	};

	const areAnyChecked = !!items?.length;
	const show = areAnyChecked || undoCount;

	if (!show) return null;

	if (undoCount) {
		return (
			<Box
				direction="row"
				align="center"
				gap={3}
				css={{
					px: '$2',
					py: '$1',
					borderRadius: '$lg',
					background: '$gray20',
				}}
				className={className}
			>
				<Span
					css={{
						whiteSpace: 'nowrap',
						ml: '$2',
					}}
				>
					Deleted {undoCount} {pluralize('item', undoCount)}.
				</Span>
				<Button size="small" color="default" onClick={undoDelete} {...rest}>
					Undo
				</Button>
			</Box>
		);
	}

	return (
		<Button
			color="default"
			size="small"
			ref={ref}
			onClick={deleteCompleted}
			className={className}
			{...rest}
		>
			Delete Purchased
		</Button>
	);
});

export default DeleteCheckedButton;
