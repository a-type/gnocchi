import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { trpc } from '@/trpc.js';
import { Box, Button } from '@aglio/ui';

export interface RecipePublishControlProps {
	recipeId: string;
}

export function RecipePublishControl({ recipeId }: RecipePublishControlProps) {
	const isSubscribed = useIsSubscribed();

	const { data, isLoading, refetch } = trpc.recipes.publishedInfo.useQuery({
		recipeId,
	});

	if (!isSubscribed) return null;

	if (isLoading) {
		return <Button disabled>Publish</Button>;
	}

	if (data) {
		return (
			<PublishedButton
				recipeId={recipeId}
				publishedAt={data.publishedAt}
				onChange={refetch}
			/>
		);
	} else {
		return <UnpublishedButton recipeId={recipeId} onChange={refetch} />;
	}
}

function PublishedButton({
	recipeId,
	publishedAt,
	onChange,
}: {
	recipeId: string;
	publishedAt: string;
	onChange?: () => void;
}) {
	const unpublish = trpc.recipes.unpublish.useMutation({
		onSuccess: onChange,
	});

	return (
		<Box direction="column" gap={2} align="start">
			<span>Published {new Date(publishedAt).toLocaleDateString()}</span>
			<Button
				color="destructive"
				onClick={() =>
					unpublish.mutate({
						recipeId,
					})
				}
			>
				Unpublish
			</Button>
		</Box>
	);
}

function UnpublishedButton({
	recipeId,
	onChange,
}: {
	recipeId: string;
	onChange?: () => void;
}) {
	const publish = trpc.recipes.publish.useMutation({
		onSuccess: onChange,
	});

	return (
		<Button
			color="default"
			onClick={() =>
				publish.mutate({
					recipeId,
				})
			}
		>
			Publish
		</Button>
	);
}
