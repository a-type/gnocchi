import { RecipeCreateButton } from '@/components/recipes/collection/RecipeCreateButton.jsx';
import { Box } from '@aglio/ui/src/components/box';
import { P } from '@aglio/ui/src/components/typography';
import { sprinkles } from '@aglio/ui/styles';
import { FilePlusIcon } from '@radix-ui/react-icons';
import { Suspense } from 'react';

export interface EmptyStateProps {
	className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
	return (
		<Box
			m="auto"
			direction="column"
			align="center"
			gap={4}
			mt={12}
			className={className}
		>
			<FilePlusIcon
				style={{ width: 120, height: 120 }}
				className={sprinkles({
					color: 'gray50',
				})}
			/>
			<P>There are no recipes in your collection.</P>
			<Suspense>
				<RecipeCreateButton />
			</Suspense>
		</Box>
	);
}
