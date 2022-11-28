import { Dialog, DialogContent } from '@/components/primitives/Dialog.jsx';
import {
	Form,
	SubmitButton,
	TextField,
} from '@/components/primitives/forms.jsx';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/primitives/select/Select.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Formik } from 'formik';
import { useState } from 'react';

export interface ListSelectProps {
	value: string | null;
	onChange: (value: string | null) => void;
}

export function ListSelect({ value, onChange }: ListSelectProps) {
	const lists = hooks.useAllLists();
	const [isCreating, setIsCreating] = useState(false);
	const client = hooks.useClient();

	return (
		<>
			<Select
				value={value ?? 'null'}
				onValueChange={(val) => {
					if (val === 'null') onChange(null);
					else if (val === 'new') {
						setIsCreating(true);
					} else onChange(val);
				}}
			>
				<SelectTrigger>
					<SelectValue />
					<SelectIcon />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={'null'}>Default</SelectItem>
					{lists.map((list) => (
						<SelectItem key={list.get('id')} value={list.get('id')}>
							{list.get('name')}
						</SelectItem>
					))}
					<SelectSeparator />
					<SelectItem value={'new'}>New List</SelectItem>
				</SelectContent>
			</Select>
			<Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
				<DialogContent>
					<Formik
						initialValues={{ name: '' }}
						onSubmit={async ({ name }, bag) => {
							const list = await client.lists.put({ name });
							onChange(list.get('id'));
							setIsCreating(false);
						}}
					>
						<Form>
							<TextField name="name" label="Name" placeholder="Custom list" />
							<SubmitButton css={{ alignSelf: 'fled-end' }}>
								Create
							</SubmitButton>
						</Form>
					</Formik>
				</DialogContent>
			</Dialog>
		</>
	);
}
