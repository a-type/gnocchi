import { hooks } from '@/stores/groceries/index.js';
import { ReactNode, Suspense, useState } from 'react';
import { CategorySelect } from '../groceries/categories/CategorySelect.jsx';
import { Icon } from '../icons/Icon.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { useToggle, withClassName } from '@aglio/ui/hooks';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { Button } from '@aglio/ui/components/button';
import { H3 } from '@aglio/ui/components/typography';
import { LiveUpdateTextField } from '@aglio/ui/components/liveUpdateTextField';
import { Checkbox } from '@aglio/ui/src/components/checkbox';
import { FoodName } from '@/components/foods/FoodName.jsx';
import { FoodNamesEditor } from '@/components/foods/FoodNamesEditor.jsx';
import { Divider } from '@aglio/ui/src/components/divider';
import { useSearchParams } from '@verdant-web/react-router';

export interface FoodDetailDialogProps {}

export function FoodDetailDialog({}: FoodDetailDialogProps) {
	const [params, setParams] = useSearchParams();
	const foodName = params.get('showFood');
	const open = !!foodName;
	const onClose = () => {
		setParams((old) => {
			old.delete('showFood');
			return old;
		});
	};
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<Suspense>
					{foodName && <FoodDetailView foodName={foodName} open={open} />}
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
	const client = hooks.useClient();
	const food = hooks.useOneFood({
		index: {
			where: 'anyName',
			equals: foodName,
		},
		skip: !open,
	});
	hooks.useWatch(food);

	const [justDeleted, setJustDeleted] = useState(false);

	if (!food)
		return (
			<div className="flex flex-col items-center gap-4">
				<div>No food data for "{foodName}"</div>
				{justDeleted && (
					<Button color="ghost" onClick={() => client.undoHistory.undo()}>
						Undo delete
					</Button>
				)}
			</div>
		);

	return (
		<div className="flex flex-col gap-3">
			<DialogTitle>
				<FoodName food={food} capitalize />
			</DialogTitle>
			<Row>
				<span>Category:</span>
				<CategorySelect
					value={food.get('categoryId')}
					onChange={(val) => food.set('categoryId', val)}
					inDialog
				/>
			</Row>
			<Row>
				<span>Default list:</span>
				<ListSelect
					value={food.get('defaultListId')}
					onChange={(val) => food.set('defaultListId', val)}
					includeAll={false}
					inDialog
				/>
			</Row>
			<Divider />
			<div className="flex gap-1 flex-col">
				<Row>
					<span className="whitespace-nowrap">Expires after</span>
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
				</Row>
				<span className="text-xs">
					Set this and the app will remind you when something is about to
					expire. Only affects newly purchased items.
				</span>
			</div>
			<Divider />
			<H3>Alternate names</H3>
			<FoodNamesEditor names={food.get('alternateNames')} />
			<Row>
				<Checkbox
					checked={food.get('pluralizeName')}
					onCheckedChange={(val) => food.set('pluralizeName', val === true)}
				/>
				<span>Use pluralized name</span>
			</Row>
			<Divider />
			<Row>
				<Checkbox
					checked={food.get('doNotSuggest')}
					onCheckedChange={(val) => food.set('doNotSuggest', val === true)}
				/>
				<span>Do not suggest</span>
			</Row>
			<Row>
				<Button
					onClick={() => {
						client.foods.delete(food.get('canonicalName'));
						setJustDeleted(true);
					}}
					color="destructive"
				>
					Delete
				</Button>
			</Row>
		</div>
	);
}

const Row = withClassName('div', 'flex flex-row items-center gap-1');
