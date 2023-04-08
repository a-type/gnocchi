import { hooks } from '@/stores/groceries/index.js';
import { ReactNode, Suspense, useState } from 'react';
import { capitalize } from '@aglio/tools';
import { CategorySelect } from '../groceries/categories/CategorySelect.jsx';
import * as classes from './FoodDetailDialog.css.js';
import { Icon } from '../icons/Icon.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { useToggle } from '@aglio/ui/hooks';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { Button } from '@aglio/ui/components/button';
import { Box } from '@aglio/ui/components/box';
import { H3, P, Span } from '@aglio/ui/components/typography';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';
import { Checkbox } from '@aglio/ui/src/components/checkbox';
import { FoodName } from '@/components/foods/FoodName.jsx';
import { FoodNamesEditor } from '@/components/foods/FoodNamesEditor.jsx';
import { Divider } from '@aglio/ui/src/components/divider';

export interface FoodDetailDialogProps {
	foodName: string;
	children?: ReactNode;
}

export function FoodDetailDialog({
	foodName,
	children,
}: FoodDetailDialogProps) {
	const [open, toggleOpen] = useToggle(false);

	return (
		<Dialog open={open} onOpenChange={toggleOpen}>
			<DialogTrigger asChild>
				{children || (
					<Button size="icon" color="ghost">
						<Icon name="food" />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<Suspense>
					<FoodDetailView
						foodName={foodName}
						open={open}
						toggleOpen={toggleOpen}
					/>
				</Suspense>
				<DialogActions>
					<DialogClose asChild>
						<Button>Close</Button>
					</DialogClose>
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function FoodDetailView({
	foodName,
	open,
	toggleOpen,
}: {
	foodName: string;
	open: boolean;
	toggleOpen: () => void;
}) {
	const client = hooks.useClient();
	const food = hooks.useOneFood({
		index: {
			where: 'nameLookup',
			equals: foodName,
		},
		skip: !open,
	});
	hooks.useWatch(food);

	const [justDeleted, setJustDeleted] = useState(false);

	if (!food)
		return (
			<Box direction="column" align="center" gap={4}>
				<div>No food data for "{foodName}"</div>
				{justDeleted && (
					<Button color="ghost" onClick={() => client.undoHistory.undo()}>
						Undo delete
					</Button>
				)}
			</Box>
		);

	return (
		<Box gap={3}>
			<DialogTitle>
				<FoodName food={food} capitalize />
			</DialogTitle>
			<Box gap={1} direction="row" alignItems="center">
				<span>Category:</span>
				<CategorySelect
					value={food.get('categoryId')}
					onChange={(val) => food.set('categoryId', val)}
					contentClassName={classes.categoryContent}
				/>
			</Box>
			<Box gap={1} direction="row" alignItems="center">
				<span>Default list:</span>
				<ListSelect
					value={food.get('defaultListId')}
					onChange={(val) => food.set('defaultListId', val)}
					includeAll={false}
					inDialog
				/>
			</Box>
			<Divider />
			<Box gap={1} direction="column">
				<Box gap={1} direction="row" alignItems="center">
					<Span noWrap>Expires after</Span>
					<LiveUpdateTextField
						type="number"
						value={food.get('expiresAfterDays')?.toString() ?? ''}
						onChange={(val) => {
							if (val === '') {
								food.set('expiresAfterDays', null);
								return;
							} else {
								const v = parseInt(val);
								if (isNaN(v)) return;
								food.set('expiresAfterDays', v);
							}
						}}
					/>
					<span>days</span>
				</Box>
				<Span size="xs">
					Set this and the app will remind you when something is about to
					expire. Only affects newly purchased items.
				</Span>
			</Box>
			<Divider />
			<H3>Alternate names</H3>
			<FoodNamesEditor names={food.get('alternateNames')} />
			<Box gap={1} direction="row" alignItems="center">
				<Checkbox
					checked={food.get('pluralizeName')}
					onCheckedChange={(val) => food.set('pluralizeName', val === true)}
				/>
				<Span>Use pluralized name</Span>
			</Box>
			<Divider />
			<Box gap={1} direction="row" alignItems="center">
				<Button
					onClick={() => {
						client.foods.delete(food.get('canonicalName'));
						setJustDeleted(true);
					}}
					color="destructive"
				>
					Delete
				</Button>
			</Box>
		</Box>
	);
}
