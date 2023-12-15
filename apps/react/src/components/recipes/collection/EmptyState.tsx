import { Icon } from '@/components/icons/Icon.jsx';
import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { useIsFiltered } from '@/components/recipes/collection/hooks.js';
import { P } from '@a-type/ui/components/typography';
import { FilePlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { Suspense } from 'react';

export interface EmptyStateProps {
	className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
	const isFiltered = useIsFiltered();

	if (isFiltered) {
		return (
			<div
				className={classNames(
					'flex m-auto flex-col items-center gap-4 mt-12 select-none',
					className,
				)}
			>
				<Icon name="filter" size={120} className="color-gray5" />
				<P>No recipes match your search.</P>
			</div>
		);
	}

	return (
		<div
			className={classNames(
				'm-auto flex flex-col gap-4 items-center mt-12 select-none',
				className,
			)}
		>
			<FilePlusIcon
				style={{ width: 120, height: 120 }}
				className="color-gray5"
			/>
			<P>There are no recipes in your collection.</P>
			<Suspense>
				<RecipeCreateButton />
			</Suspense>
		</div>
	);
}
