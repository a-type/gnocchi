import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { trpc } from '@/trpc.js';
import { Box, Button } from '@aglio/ui';
import { toast } from 'react-hot-toast';

export interface RecipePublishControlProps {
	recipeId: string;
}

export function RecipePublishControl({ recipeId }: RecipePublishControlProps) {
	const enabled = useFeatureFlag('hub');
	const isSubscribed = useIsSubscribed();

	const { data, isLoading, refetch } = trpc.recipes.publishedInfo.useQuery({
		recipeId,
	});

	if (!enabled || !isSubscribed) return null;

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
		<Box direction="column" gap={2} align="flex-start">
			<span>Published {new Date(publishedAt).toLocaleDateString()}</span>
			<Button
				color="destructive"
				onClick={async () => {
					try {
						await unpublish.mutateAsync({
							recipeId,
						});
					} catch (err) {
						console.error(err);
						toast.error('Failed to unpublish recipe');
					}
				}}
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
			onClick={async () => {
				try {
					await publish.mutateAsync({
						recipeId,
					});
				} catch (err) {
					console.error(err);
					toast.error('Failed to publish recipe');
				}
			}}
		>
			Publish
		</Button>
	);
}
