import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { hooks } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { Recipe } from '@aglio/groceries-client';
import { Button } from '@aglio/ui/components/button';
import { Checkbox } from '@aglio/ui/components/checkbox';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@aglio/ui/components/dialog';
import { TextLink } from '@/components/nav/Link.jsx';
import { P } from '@aglio/ui/components/typography';
import format from 'date-fns/format';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export interface RecipePublishControlProps {
	recipe: Recipe;
}

export function RecipePublishControl({ recipe }: RecipePublishControlProps) {
	const enabled = useFeatureFlag('hub');
	const isSubscribed = useIsSubscribed();

	const recipeId = recipe.get('id');

	const { data, isLoading, refetch } = trpc.recipes.publishedInfo.useQuery({
		recipeId,
	});

	const updatedAt = hooks.useWatch(recipe, 'updatedAt');

	// forbid publishing for non-subscribers or recipes with a source URL
	if (!enabled || !isSubscribed || recipe.get('url')) return null;

	if (isLoading) {
		return (
			<Button size="small" disabled>
				Publish
			</Button>
		);
	}

	const isPublished = !!data;
	const isOutOfDate =
		isPublished && new Date(data.publishedAt).getTime() < updatedAt;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button color={isOutOfDate ? 'accent' : 'default'} size="small">
					{isOutOfDate
						? 'Republish changes'
						: isPublished
						? 'Published'
						: 'Publish'}
				</Button>
			</DialogTrigger>
			{data ? (
				<PublishedContent
					recipeId={recipeId}
					publishedAt={data.publishedAt}
					updatedAt={updatedAt}
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
	updatedAt,
}: {
	recipeId: string;
	publishedAt: string;
	updatedAt: number;
	onChange?: () => void;
	url: string;
}) {
	const unpublish = trpc.recipes.unpublish.useMutation({
		onSuccess: onChange,
	});
	const publish = trpc.recipes.publish.useMutation({
		onSuccess: onChange,
	});

	const publishDate = new Date(publishedAt);
	const outOfDate = updatedAt > publishDate.getTime();

	return (
		<DialogContent>
			<DialogTitle>Manage publication</DialogTitle>
			<P>Published {format(publishDate, 'PPp')}</P>
			{outOfDate && (
				<P className="color-attention-dark">
					Updated {format(new Date(updatedAt), 'PPp')}
				</P>
			)}
			<TextLink to={url} newTab>
				View on the web
			</TextLink>
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
				{outOfDate && (
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
						Publish latest changes
					</Button>
				)}
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
			<div className="flex flex-col gap-4">
				<P>
					Published recipes can be shared with others on the web. You retain
					full rights to your recipe and can unpublish anytime
				</P>
				<div className="flex flex-row items-start gap-2">
					<Checkbox
						checked={consent}
						onCheckedChange={(c) => setConsent(c !== false)}
						id="publish-consent"
					/>
					<label htmlFor="publish-consent" className="text-xs">
						I confirm that I own and have the right to publish this recipe, in
						accordance with the{' '}
						<TextLink to="https://www.aglio.com/terms" newTab>
							Aglio Terms of Service
						</TextLink>
					</label>
				</div>
			</div>
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
