import { LinkButton, LinkButtonProps } from '@/components/primitives/index.js';

export interface RecipeViewerEditButtonProps
	extends Omit<LinkButtonProps, 'to'> {
	slug: string;
}

export function RecipeViewerEditButton({
	slug,
	...rest
}: RecipeViewerEditButtonProps) {
	return (
		<LinkButton
			size="small"
			color="default"
			to={`/recipes/${slug}/edit`}
			{...rest}
		>
			Edit
		</LinkButton>
	);
}
