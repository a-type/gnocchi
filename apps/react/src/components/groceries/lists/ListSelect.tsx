import { Form, SubmitButton, TextField } from '@aglio/ui/components/forms';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@aglio/ui/components/select';
import { hooks } from '@/stores/groceries/index.js';
import { themeMap, withClassName } from '@aglio/ui/styles';
import { Formik } from 'formik';
import { useState } from 'react';
import { Icon } from '@/components/icons/Icon.jsx';
import classNames from 'classnames';
import { ThemeName } from '@aglio/ui/components/colorPicker';
import { Box } from '@aglio/ui/components/box';
import { Dialog, DialogContent } from '@aglio/ui/components/dialog';

function getRandomColor(): ThemeName {
	const colors = Object.keys(themeMap);
	return colors[Math.floor(Math.random() * colors.length)] as any;
}

export interface ListSelectProps {
	includeAll?: boolean;
	value: string | null | undefined;
	onChange: (value: string | null | undefined) => void;
	inDialog?: boolean;
}

const FilledIcon = withClassName(Icon, 'important:fill-primary');

export function ListSelect({
	value,
	onChange,
	includeAll,
	inDialog,
}: ListSelectProps) {
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
				<SelectContent inDialog={inDialog}>
					{includeAll && <SelectItem value="undefined">All lists</SelectItem>}
					<SelectItem value={'null'}>
						<Box direction="row" gap={2} align="center">
							<FilledIcon name="tag" className="theme-lemon" />
							<span>Default</span>
						</Box>
					</SelectItem>
					{lists.map((list) => (
						<SelectItem key={list.get('id')} value={list.get('id')}>
							<Box direction="row" gap={2} align="center">
								<FilledIcon
									name="tag"
									className={`theme-${list.get('color') ?? 'lemon'}`}
								/>
								<span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
									{list.get('name')}
								</span>
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
							<SubmitButton className="self-end">Create</SubmitButton>
						</Form>
					</Formik>
				</DialogContent>
			</Dialog>
		</>
	);
}
