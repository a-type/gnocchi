import { RouterOutputs, trpc } from '@/trpc.js';
import { ActionBar, ActionButton } from '@a-type/ui/components/actions';
import { Button } from '@a-type/ui/components/button';
import { Checkbox } from '@a-type/ui/components/checkbox';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import {
	SubmitButton,
	TextField,
	FormikForm,
} from '@a-type/ui/components/forms';
import { Input } from '@a-type/ui/components/input';
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
		<div>
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
			<div className="flex flex-col gap-3">
				{foods.map((food) => (
					<FoodManagerItem food={food} key={food.canonicalName} />
				))}
				{!foods.length && <div>No foods</div>}
			</div>
		</div>
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
			<div className="flex flex-row">
				<div className="flex-1">{food.canonicalName}</div>
				<DialogTrigger asChild>
					<Button size="icon">
						<DotsHorizontalIcon />
					</Button>
				</DialogTrigger>
			</div>
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
		<select {...props} className="my-3">
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
		<div className="flex flex-col gap-3">
			{food.names.map(({ name }) => (
				<label className="flex flex-row gap-3">
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
				</label>
			))}
			{addNamesValue.map((name) => (
				<label className="flex flex-row gap-3">
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
				</label>
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
		</div>
	);
}
