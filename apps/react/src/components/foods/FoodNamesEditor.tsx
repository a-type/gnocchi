import { hooks } from '@/stores/groceries/index.js';
import { FoodAlternateNames } from '@aglio/groceries-client';
import { Button } from '@a-type/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import { Form, SubmitButton, TextField } from '@a-type/ui/components/forms';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export interface FoodNamesEditorProps {
	names: FoodAlternateNames;
}

export function FoodNamesEditor({ names }: FoodNamesEditorProps) {
	hooks.useWatch(names);
	const asArray = names.getAll();
	const unique = Array.from(new Set(asArray));

	return (
		<div className="flex flex-row items-center flex-wrap gap-2">
			{unique.map((name) => (
				<FoodNameTag
					key={name}
					name={name}
					onDelete={(name) => names.removeAll(name)}
				/>
			))}
			<AddNameButton names={names} />
		</div>
	);
}

function FoodNameTag({
	name,
	onDelete,
}: {
	name: string;
	onDelete: (name: string) => void;
}) {
	return (
		<div className="inline-flex flex-row items-center whitespace-nowrap gap-1 px-3 py-1 rounded-2xl border border-solid border-black text-sm max-w-full overflow-hidden">
			<span className="overflow-hidden text-ellipsis">{name}</span>
			<Button
				size="icon"
				onClick={() => onDelete(name)}
				color="ghost"
				className="important:p-2px"
			>
				<Cross2Icon />
			</Button>
		</div>
	);
}

function AddNameButton({ names }: { names: FoodAlternateNames }) {
	const client = hooks.useClient();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="small"
					className="important:rounded-2xl important:px-3 important:py-1"
				>
					<PlusIcon />
					<span>Add name</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<Formik
					initialValues={{ name: '' }}
					onSubmit={async (values, bag) => {
						bag.setSubmitting(true);
						try {
							// cannot add a name that already exists elsewhere
							const lookup = await client.foods.findOne({
								index: {
									where: 'nameLookup',
									equals: values.name,
								},
							}).resolved;

							if (lookup) {
								toast.error(
									`This food name is already used by ${lookup.get(
										'canonicalName',
									)}. Food names can only be used once.`,
								);
								return;
							}
							if (values.name) {
								names.add(values.name.toLowerCase());
							}
							setOpen(false);
						} finally {
							bag.setSubmitting(false);
						}
					}}
				>
					<Form>
						<TextField name="name" label="Name" required />
						<DialogActions>
							<DialogClose asChild>
								<Button>Cancel</Button>
							</DialogClose>
							<SubmitButton>Add</SubmitButton>
						</DialogActions>
					</Form>
				</Formik>
			</DialogContent>
		</Dialog>
	);
}
