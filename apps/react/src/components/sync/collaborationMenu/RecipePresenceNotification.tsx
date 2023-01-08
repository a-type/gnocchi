import { Button, LinkButton } from '@/components/primitives/index.js';
import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { hooks, Presence, Profile } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { UserInfo } from '@lo-fi/common';
import { Suspense, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import * as classes from './RecipePresenceNotification.css.js';
import { PageNowPlaying } from '@/components/layouts/index.jsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { PersonAvatar } from '../people/PersonAvatar.jsx';

export interface RecipePresenceNotificationProps {}

export function RecipePresenceNotification({}: RecipePresenceNotificationProps) {
	const isSubscribed = useIsSubscribed();
	const flagEnabled = useFeatureFlag('recipePresence');

	if (flagEnabled && isSubscribed) {
		return (
			<Suspense>
				<RecipePresenceNotificationContent />
			</Suspense>
		);
	} else {
		return null;
	}
}

function RecipePresenceNotificationContent() {
	const [dismissedId, setDismissedId] = useState('');

	// while visible, enable sync at 30s interval
	const maybeClient = hooks.useUnsuspendedClient();
	useEffect(() => {
		if (maybeClient) {
			const originalInterval = maybeClient.sync.pullInterval;
			maybeClient.sync.setPullInterval(30000);
			maybeClient.sync.start();
			return () => {
				maybeClient.sync.setPullInterval(originalInterval);
				maybeClient.sync.stop();
			};
		}
	}, [maybeClient]);

	const viewingRecipe = hooks.useFindPeer((peer) => {
		return !!peer.presence.viewingRecipeId;
	});

	const recipeId = viewingRecipe?.presence.viewingRecipeId;

	if (recipeId && recipeId !== dismissedId) {
		return (
			<PageNowPlaying className={classes.nowPlaying}>
				<RecipePresenceLink
					person={viewingRecipe}
					recipeId={recipeId}
					onDismiss={() => setDismissedId(recipeId)}
				/>
			</PageNowPlaying>
		);
	} else {
		return null;
	}
}

function RecipePresenceLink({
	recipeId,
	person,
	onDismiss,
}: {
	recipeId: string;
	person: UserInfo<Profile, Presence>;
	onDismiss: () => void;
}) {
	const recipe = hooks.useRecipe(recipeId);

	if (!recipe) return null;

	return (
		<div className={classes.root}>
			<Button size="small" onClick={onDismiss} color="ghost">
				<Cross2Icon />
			</Button>
			<PersonAvatar person={person} />
			<div className={classes.titleStack}>
				<div className={classes.name}>
					&nbsp;{person.profile.name} is cooking
				</div>
				<div className={classes.title}>{recipe.get('title')}</div>
			</div>
			<LinkButton
				size="small"
				to={`/recipes/${recipe.get('slug')}/cook`}
				className={classes.button}
				onClick={onDismiss}
			>
				Join
			</LinkButton>
		</div>
	);
}
