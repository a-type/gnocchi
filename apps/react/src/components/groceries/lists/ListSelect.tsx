import { TagIcon } from '@/components/icons/TagIcon.jsx';
import { Form, SubmitButton, TextField } from '@aglio/ui';
import { Dialog, DialogContent, Box, ColorSwatch, ThemeName } from '@aglio/ui';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@aglio/ui';
import { hooks } from '@/stores/groceries/index.js';
import { sprinkles } from '@aglio/ui';
import { themeMap } from '@aglio/ui';
import { Formik } from 'formik';
import { useState } from 'react';
import * as classes from './ListSelect.css.js';

function getRandomColor(): ThemeName {
	const colors = Object.keys(themeMap);
	return colors[Math.floor(Math.random() * colors.length)] as any;
}

export interface ListSelectProps {
	includeAll?: boolean;
	value: string | null | undefined;
	onChange: (value: string | null | undefined) => void;
}

export function ListSelect({ value, onChange, includeAll }: ListSelectProps) {
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
					{includeAll && <SelectItem value="undefined">All lists</SelectItem>}
					<SelectItem value={'null'}>
						<Box direction="row" gap={2} align="center">
							<TagIcon fill className={themeMap.lemon} />
							<span>Default</span>
						</Box>
					</SelectItem>
					{lists.map((list) => (
						<SelectItem key={list.get('id')} value={list.get('id')}>
							<Box direction="row" gap={2} align="center">
								<TagIcon
									fill
									className={
										themeMap[(list.get('color') as ThemeName) || 'lemon']
									}
								/>
								<span className={classes.itemText}>{list.get('name')}</span>
							</Box>
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
