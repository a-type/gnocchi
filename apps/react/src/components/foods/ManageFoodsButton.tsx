import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import { FoodName } from '@/components/foods/FoodName.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Box } from '@aglio/ui/src/components/box';
import { Button } from '@aglio/ui/src/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/src/components/dialog';
import { Suspense } from 'react';

export function ManageFoodsButton() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Manage foods</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Manage foods</DialogTitle>
				<Suspense>
					<FoodsList />
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

function FoodsList() {
	const foods = hooks.useAllFoods();

	return (
		<Box display="flex" direction="column">
			{foods.map((food) => (
				<Box
					key={food.get('canonicalName')}
					direction="row"
					gap={4}
					justifyContent="space-between"
					p={2}
				>
					<Box flex={1} fontSize="md" fontWeight="bold">
						<FoodName food={food} />
					</Box>
					<FoodDetailDialog foodName={food.get('canonicalName')} />
				</Box>
			))}
		</Box>
	);
}
