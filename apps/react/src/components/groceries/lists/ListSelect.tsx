import {
	Form,
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';
import {
	Select,
	SelectContent,
	SelectIcon,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@a-type/ui/components/select';
import { hooks } from '@/stores/groceries/index.js';
import { withClassName } from '@a-type/ui/hooks';
import { useState } from 'react';
import { Icon } from '@/components/icons/Icon.jsx';
import { ThemeName } from '@a-type/ui/components/colorPicker';
import { Dialog, DialogContent } from '@a-type/ui/components/dialog';

function getRandomColor(): ThemeName {
	const colors: ThemeName[] = [
		'lemon',
		'blueberry',
		'tomato',
		'eggplant',
		'leek',
	];
	return colors[Math.floor(Math.random() * colors.length)] as any;
}

export interface ListSelectProps {
	includeAll?: boolean;
	value: string | null | undefined;
	onChange: (value: string | null | undefined) => void;
	inDialog?: boolean;
	className?: string;
}

const FilledIcon = withClassName(Icon, 'important:fill-primary');

export function ListSelect({
	value,
	onChange,
	includeAll,
	inDialog,
	className,
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
				<SelectTrigger className={className}>
					<SelectValue />
					<SelectIcon />
				</SelectTrigger>
				<SelectContent inDialog={inDialog}>
					{includeAll && <SelectItem value="undefined">All lists</SelectItem>}
					<SelectItem value={'null'}>
						<div className="flex flex-row gap-2 items-center">
							<FilledIcon name="tag" className="theme-lemon" />
							<span>Default</span>
						</div>
					</SelectItem>
					{lists.map((list) => (
						<SelectItem key={list.get('id')} value={list.get('id')}>
							<div className="flex flex-row gap-2 items-center">
								<FilledIcon
									name="tag"
									className={`theme-${list.get('color') ?? 'lemon'}`}
								/>
								<span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
									{list.get('name')}
								</span>
							</div>
						</SelectItem>
					))}
					<SelectSeparator />
					<SelectItem value={'new'}>New List</SelectItem>
				</SelectContent>
			</Select>
			<Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
				<DialogContent>
					<FormikForm
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
						<TextField
							name="name"
							label="Name"
							placeholder="Custom list"
							required
						/>
						<SubmitButton className="self-end">Create</SubmitButton>
					</FormikForm>
				</DialogContent>
			</Dialog>
		</>
	);
}
