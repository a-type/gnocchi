import { RouterOutputs, trpc } from '@/trpc.js';
import { ActionBar, ActionButton } from '@aglio/ui/src/components/actions';
import { Box } from '@aglio/ui/src/components/box';
import { Button } from '@aglio/ui/src/components/button';
import { Checkbox } from '@aglio/ui/src/components/checkbox';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/src/components/dialog';
import {
	SubmitButton,
	TextField,
	FormikForm,
} from '@aglio/ui/src/components/forms';
import { Input } from '@aglio/ui/src/components/input';
import { sprinkles } from '@aglio/ui/styles';
import { CheckIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useField } from 'formik';
import { useState } from 'react';

export interface FoodManagerProps {}

const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

export function FoodManager({}: FoodManagerProps) {
	const [letter, setLetter] = useState('a');
	const { data: foods = [] } = trpc.admin.foods.useQuery({
		startsWith: letter,
	});

	return (
		<Box>
			<h1>Foods</h1>
			<ActionBar wrap>
				{letters.map((l) => (
					<ActionButton
						key={l}
						onClick={() => setLetter(l)}
						icon={letter === l ? <CheckIcon /> : undefined}
					>
						{l.toUpperCase()}
					</ActionButton>
				))}
			</ActionBar>
			<Box direction="column" gap={3}>
				{foods.map((food) => (
					<FoodManagerItem food={food} key={food.canonicalName} />
				))}
				{!foods.length && <div>No foods</div>}
			</Box>
		</Box>
	);
}

function FoodManagerItem({
	food,
	onUpdate,
}: {
	food: RouterOutputs['admin']['foods'][number];
	onUpdate?: () => void;
}) {
	const update = trpc.admin.updateFood.useMutation();

	const categoryId =
		food.categoryAssignments.sort((a, b) => a.votes - b.votes)[0]?.categoryId ||
		null;

	return (
		<Dialog>
			<Box direction="row">
				<Box flex={1}>{food.canonicalName}</Box>
				<DialogTrigger asChild>
					<Button size="icon">
						<DotsHorizontalIcon />
					</Button>
				</DialogTrigger>
			</Box>
			<DialogContent>
				<FormikForm
					enableReinitialize
					initialValues={{
						canonicalName: food.canonicalName,
						expiresAfterDays: food.expiresAfterDays || 0,
						categoryId,
						addNames: new Array<string>(),
						removeNames: new Array<string>(),
					}}
					onSubmit={async (values) => {
						await update.mutateAsync({
							foodId: food.id,
							data: {
								canonicalName: values.canonicalName,
								expiresAfterDays: values.expiresAfterDays || null,
								categoryId: values.categoryId,
								addNames: values.addNames,
								removeNames: values.removeNames,
							},
						});
						onUpdate?.();
					}}
				>
					<TextField name="canonicalName" label="Canonical Name" />
					<TextField
						name="expiresAfterDays"
						type="number"
						label="Expires After Days"
					/>
					<CategorySelect />
					<NameChanger food={food} />
					<DialogActions>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
						<SubmitButton>Save</SubmitButton>
					</DialogActions>
				</FormikForm>
			</DialogContent>
		</Dialog>
	);
}

function CategorySelect() {
	const { data: categories = [] } = trpc.categories.defaults.useQuery();
	const [props] = useField({
		name: 'categoryId',
	});

	return (
		<select {...props} className={sprinkles({ my: 3 })}>
			<option value="">None</option>
			{categories.map((category) => (
				<option value={category.id}>{category.name}</option>
			))}
		</select>
	);
}

function NameChanger({
	food,
}: {
	food: RouterOutputs['admin']['foods'][number];
}) {
	const [{ value: addNamesValue }, _, addNamesHelpers] =
		useField<string[]>('addNames');
	const [{ value: removeNamesValue }, __, removeNamesHelpers] =
		useField<string[]>('removeNames');

	const addName = (name: string) => {
		addNamesHelpers.setValue(Array.from(new Set([...addNamesValue, name])));
	};
	const unAddName = (name: string) => {
		addNamesHelpers.setValue(addNamesValue.filter((n) => n !== name));
	};
	const removeName = (name: string) => {
		removeNamesHelpers.setValue(
			Array.from(new Set([...removeNamesValue, name])),
		);
	};
	const unremoveName = (name: string) => {
		removeNamesHelpers.setValue(removeNamesValue.filter((n) => n !== name));
	};

	return (
		<Box direction="column" gap={3}>
			{food.names.map(({ name }) => (
				<Box as="label" direction="row" gap={3}>
					<Checkbox
						checked={!removeNamesValue.includes(name)}
						onCheckedChange={(checked) => {
							if (checked) {
								unremoveName(name);
							} else {
								removeName(name);
							}
						}}
					/>
					{name}
				</Box>
			))}
			{addNamesValue.map((name) => (
				<Box as="label" direction="row" gap={3}>
					<Checkbox
						checked={true}
						onCheckedChange={(checked) => {
							if (checked) {
								unAddName(name);
							} else {
								addName(name);
							}
						}}
					/>
					{name}
				</Box>
			))}
			<Input
				placeholder="Add name"
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						addName(e.currentTarget.value);
						e.currentTarget.value = '';
					}
				}}
			/>
		</Box>
	);
}
