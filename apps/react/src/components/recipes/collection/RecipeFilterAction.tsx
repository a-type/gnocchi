import { hooks } from '@/stores/groceries/index.js';
import classNames from 'classnames';
import { forwardRef, Suspense, useState } from 'react';
import { useRecipeFoodFilter, useRecipeTagFilter } from './hooks.js';
import { RecipeTagsList } from './RecipeTagsList.jsx';
import { Icon } from '@/components/icons/Icon.jsx';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@a-type/ui/components/popover';
import { ActionButton } from '@a-type/ui/components/actions';
import {
	Form,
	FormikForm,
	SubmitButton,
	TextField,
} from '@a-type/ui/components/forms';

export interface RecipeFilterActionProps {}

export function RecipeTagFilterAction({}: RecipeFilterActionProps) {
	const [open, setOpen] = useState(false);
	const [tagFilter, setTagFilter] = useRecipeTagFilter();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Suspense>
				<PopoverTrigger asChild>
					<SelectedTagDisplay />
				</PopoverTrigger>
			</Suspense>
			<PopoverContent containerClassName="w-full">
				<PopoverArrow />
				<Suspense>
					<RecipeTagsList
						selectedValue={tagFilter}
						onSelect={(tag) => {
							setTagFilter(tag);
							setOpen(false);
						}}
					/>
				</Suspense>
			</PopoverContent>
		</Popover>
	);
}

const SelectedTagDisplay = forwardRef<HTMLButtonElement, any>(
	function SelectedTagDisplay(props, ref) {
		const [tagFilter, setTagFilter] = useRecipeTagFilter();
		const selectedTag = hooks.useRecipeTagMetadata(tagFilter!, {
			skip: !tagFilter,
		});

		if (!selectedTag) {
			return (
				<ActionButton
					{...props}
					color="default"
					ref={ref}
					icon={<Icon name="filter" />}
				>
					Tag...
				</ActionButton>
			);
		}

		return (
			<ActionButton
				color="primary"
				{...props}
				icon={selectedTag.get('icon') ?? <Icon name="filter" />}
				onClick={() => {
					setTagFilter(null);
				}}
				ref={ref}
				className={classNames(
					'flex items-center justify-center gap-2',
					selectedTag.get('color') && `theme-${selectedTag.get('color')}}`,
				)}
			>
				{selectedTag.get('name')}
			</ActionButton>
		);
	},
);

export function RecipeFoodFilterAction() {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<Suspense>
				<PopoverTrigger asChild>
					<SelectedFoodDisplay />
				</PopoverTrigger>
			</Suspense>
			<PopoverContent>
				<PopoverArrow />
				<FoodFilterContent onSubmit={() => setOpen(false)} />
			</PopoverContent>
		</Popover>
	);
}

const SelectedFoodDisplay = forwardRef<HTMLButtonElement, any>(
	function SelectedFoodDisplay(props, ref) {
		const [foodFilter, setFoodFilter] = useRecipeFoodFilter();

		return (
			<ActionButton
				{...props}
				color={foodFilter ? 'primary' : 'default'}
				ref={ref}
				icon={<Icon name="filter" />}
				onClick={
					foodFilter
						? () => {
								setFoodFilter(null);
						  }
						: props.onClick
				}
			>
				{foodFilter ?? 'Food...'}
			</ActionButton>
		);
	},
);

function FoodFilterContent({ onSubmit }: { onSubmit?: () => void }) {
	const [, setFoodFilter] = useRecipeFoodFilter();
	const client = hooks.useClient();

	return (
		<FormikForm
			initialValues={{ foodFilter: '' }}
			onSubmit={async (values) => {
				const foodName = values.foodFilter;
				const lookup = await client.foods.findOne({
					index: {
						where: 'nameLookup',
						startsWith: foodName,
					},
				}).resolved;

				setFoodFilter(lookup?.get('canonicalName') || foodName);
				onSubmit?.();
			}}
		>
			<TextField name="foodFilter" placeholder="Type a food name" />
			<SubmitButton>Search</SubmitButton>
		</FormikForm>
	);
}
