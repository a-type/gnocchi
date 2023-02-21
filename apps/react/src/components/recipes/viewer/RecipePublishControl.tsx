import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { trpc } from '@/trpc.js';
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
	P,
	TextLink,
	sprinkles,
} from '@aglio/ui';
import { useState } from 'react';
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
		return (
			<Button size="small" disabled>
				Publish
			</Button>
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button color={data ? 'accent' : 'default'} size="small">
					{data ? 'Published' : 'Publish'}
				</Button>
			</DialogTrigger>
			{data ? (
				<PublishedContent
					recipeId={recipeId}
					publishedAt={data.publishedAt}
					onChange={refetch}
					url={data.url}
				/>
			) : (
				<UnpublishedContent recipeId={recipeId} onChange={refetch} />
			)}
		</Dialog>
	);
}

function PublishedContent({
	recipeId,
	publishedAt,
	onChange,
	url,
}: {
	recipeId: string;
	publishedAt: string;
	onChange?: () => void;
	url: string;
}) {
	const unpublish = trpc.recipes.unpublish.useMutation({
		onSuccess: onChange,
	});
	const publish = trpc.recipes.publish.useMutation({
		onSuccess: onChange,
	});

	return (
		<DialogContent>
			<DialogTitle>Manage publication</DialogTitle>
			<P>
				Published {new Date(publishedAt).toLocaleDateString()}
				<span>&nbsp;&nbsp;</span>
				<TextLink href={url} target="_blank">
					View on the web
				</TextLink>
			</P>
			<DialogActions>
				<DialogClose asChild>
					<Button>Close</Button>
				</DialogClose>
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
				<Button
					color="primary"
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
					Republish
				</Button>
			</DialogActions>
		</DialogContent>
	);
}

function UnpublishedContent({
	recipeId,
	onChange,
}: {
	recipeId: string;
	onChange?: () => void;
}) {
	const [consent, setConsent] = useState(false);
	const publish = trpc.recipes.publish.useMutation({
		onSuccess: onChange,
	});

	return (
		<DialogContent>
			<DialogTitle>Publish your recipe</DialogTitle>
			<Box direction="column" gap={4}>
				<P>
					Published recipes can be shared with others on the web. You retain
					full rights to your recipe and can unpublish anytime
				</P>
				<Box direction="row" align="flex-start" gap={2}>
					<Checkbox
						checked={consent}
						onCheckedChange={(c) => setConsent(c !== false)}
						id="publish-consent"
					/>
					<label
						htmlFor="publish-consent"
						className={sprinkles({ fontSize: 'xs' })}
					>
						I confirm that I own and have the right to publish this recipe, in
						accordance with the{' '}
						<TextLink href="https://www.aglio.com/terms" target="_blank">
							Aglio Terms of Service
						</TextLink>
					</label>
				</Box>
			</Box>
			<DialogActions>
				<DialogClose asChild>
					<Button>Cancel</Button>
				</DialogClose>
				<Button
					color="primary"
					disabled={!consent}
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
			</DialogActions>
		</DialogContent>
	);
}
