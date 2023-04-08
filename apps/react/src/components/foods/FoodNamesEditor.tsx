import { hooks } from '@/stores/groceries/index.js';
import { Food, FoodAlternateNames } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/src/components/button';
import { Span } from '@aglio/ui/src/components/typography';
import { Cross2Icon, PlusCircledIcon, PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import * as classes from './FoodNamesEditor.css.js';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from '@aglio/ui/src/components/dialog';
import { Formik, setNestedObjectValues } from 'formik';
import { Form, SubmitButton, TextField } from '@aglio/ui/src/components/forms';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export interface FoodNamesEditorProps {
	names: FoodAlternateNames;
}

export function FoodNamesEditor({ names }: FoodNamesEditorProps) {
	hooks.useWatch(names);
	const asArray = names.getAll();
	const unique = Array.from(new Set(asArray));

	return (
		<div className={classes.root}>
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
		<div className={classes.tag}>
			<Span>{name}</Span>
			<Button
				size="icon"
				onClick={() => onDelete(name)}
				color="ghost"
				className={classes.removeButton}
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
				<Button size="small">
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
								where: 'nameLookup',
								equals: values.name,
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
