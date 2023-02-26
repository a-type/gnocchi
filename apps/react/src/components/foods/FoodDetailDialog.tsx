import { hooks } from '@/stores/groceries/index.js';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	LiveUpdateTextField,
	P,
	Switch,
	useToggle,
} from '@aglio/ui';
import { ReactNode, Suspense } from 'react';
import { FoodIcon } from '../icons/FoodIcon.jsx';
import { capitalize } from '@aglio/tools';

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
						<FoodIcon />
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<Suspense>
					<FoodDetailView foodName={foodName} open={open} />
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
}: {
	foodName: string;
	open: boolean;
}) {
	const food = hooks.useOneFood({
		index: {
			where: 'nameLookup',
			equals: foodName,
		},
		skip: !open,
	});
	hooks.useWatch(food);

	if (!food) return <div>No food data for "{foodName}"</div>;

	const alternateNames = Array.from(
		new Set(food.get('alternateNames').getAll()),
	).join(', ');

	return (
		<div>
			<DialogTitle>{capitalize(food.get('canonicalName'))}</DialogTitle>
			<P>Alternate names: {alternateNames}</P>
			<Box gap={1} direction="row" alignItems="center">
				<span>Expires after</span>
				<LiveUpdateTextField
					type="number"
					value={food.get('expiresAfterDays')?.toString() ?? ''}
					onChange={(val) => {
						const v = parseInt(val);
						if (isNaN(v)) return;
						food.set('expiresAfterDays', v);
					}}
				/>
				<span>days</span>
			</Box>
		</div>
	);
}
