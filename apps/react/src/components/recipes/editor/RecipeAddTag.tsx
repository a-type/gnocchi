import { RecipeTagsList } from '@/components/recipes/collection/RecipeTagsList.jsx';
import { NewTagForm } from '@/components/recipes/editor/NewTagForm.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/src/components/button';
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from '@aglio/ui/src/components/popover';
import { PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { ReactNode, Suspense, forwardRef, useState } from 'react';

export function RecipeAddTag({
	recipe,
	onAdd,
	empty,
	children,
	contentClassName,
	className,
}: {
	recipe: Recipe;
	onAdd?: () => void;
	empty?: boolean;
	children?: ReactNode;
	contentClassName?: string;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const addTag = (tagName: string | null) => {
		if (tagName === null) return;
		recipe.get('tags').add(tagName);
		onAdd?.();
		setOpen(false);
	};
	const { tags } = hooks.useWatch(recipe);
	hooks.useWatch(tags);
	const tagsSnapshot = tags?.getSnapshot() ?? [];

	return (
		<Popover
			open={open}
			onOpenChange={(o) => {
				if (o) setOpen(true);
			}}
		>
			{children ? (
				<PopoverTrigger asChild>{children}</PopoverTrigger>
			) : (
				<PopoverTrigger asChild className={className}>
					<DefaultTrigger />
				</PopoverTrigger>
			)}
			<PopoverContent
				className={classNames('max-w-350px', contentClassName)}
				onPointerDownOutside={() => setOpen(false)}
			>
				<PopoverArrow />
				<Suspense>
					<NewTagForm onCreate={addTag} />
					<div>
						<RecipeTagsList onSelect={addTag} omit={tagsSnapshot} />
					</div>
				</Suspense>
			</PopoverContent>
		</Popover>
	);
}

const DefaultTrigger = forwardRef<HTMLButtonElement, { className?: string }>(
	({ className, ...rest }, ref) => (
		<Button
			size="small"
			className={classNames('py-1 px-2 text-xs', className)}
			ref={ref}
			{...rest}
		>
			<PlusIcon />
			<span>Tag</span>
		</Button>
	),
);
