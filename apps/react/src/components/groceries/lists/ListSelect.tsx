import { Dialog, DialogContent } from '@/components/primitives/Dialog.jsx';
import {
	Form,
	SubmitButton,
	TextField,
} from '@/components/primitives/forms.jsx';
import { Box, ColorSwatch, ThemeName } from '@/components/primitives/index.js';
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
import { sprinkles } from '@/styles/sprinkles.css.js';
import { themeMap } from '@/styles/themes/map.js';
import { Formik } from 'formik';
import { useState } from 'react';
import { ListEdit } from './ListEdit.jsx';

function getRandomColor(): ThemeName {
	const colors = Object.keys(themeMap);
	return colors[Math.floor(Math.random() * colors.length)] as any;
}

export interface ListSelectProps {
	value: string | null | undefined;
	onChange: (value: string | null | undefined) => void;
}

export function ListSelect({ value, onChange }: ListSelectProps) {
	const lists = hooks.useAllLists();
	const [isCreating, setIsCreating] = useState(false);
	const client = hooks.useClient();

	return (
		<>
			<Select
				value={value ?? `${value}`}
				onValueChange={(val) => {
					if (val === 'null') onChange(null);
					if (val === 'undefined') onChange(undefined);
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
					<SelectItem value="undefined">All</SelectItem>
					{lists.length > 0 && (
						<SelectItem value={'null'}>
							<Box direction="row" gap={2} align="center">
								<ColorSwatch value="lemon" />
								<span>Default</span>
							</Box>
						</SelectItem>
					)}
					{lists.map((list) => (
						<SelectItem key={list.get('id')} value={list.get('id')}>
							<Box direction="row" gap={2} align="center">
								<ColorSwatch
									value={(list.get('color') as ThemeName) || 'lemon'}
								/>
								<span>{list.get('name')}</span>
							</Box>
						</SelectItem>
					))}
					<SelectSeparator />
					<SelectItem value={'new'}>New List</SelectItem>
				</SelectContent>
			</Select>
			{value && <ListEdit listId={value} />}
			<Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
				<DialogContent>
					<Formik
						initialValues={{ name: '' }}
						onSubmit={async ({ name }, bag) => {
							const list = await client.lists.put({
								name,
								color: getRandomColor(),
							});
							onChange(list.get('id'));
							setIsCreating(false);
						}}
					>
						<Form>
							<TextField
								name="name"
								label="Name"
								placeholder="Custom list"
								required
							/>
							<SubmitButton className={sprinkles({ alignSelf: 'flex-end' })}>
								Create
							</SubmitButton>
						</Form>
					</Formik>
				</DialogContent>
			</Dialog>
		</>
	);
}
