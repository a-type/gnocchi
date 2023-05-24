import { makeRecipeLink } from '@/components/recipes/makeRecipeLink.js';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useFeatureFlag } from '@/hooks/useFeatureFlag.js';
import { Presence, Profile, hooks } from '@/stores/groceries/index.js';
import { Button } from '@aglio/ui/components/button';
import { PageNowPlaying } from '@aglio/ui/components/layouts';
import { UserInfo } from '@verdant-web/common';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Suspense, useState } from 'react';
import { PersonAvatar } from '../people/PersonAvatar.jsx';
import { LinkButton } from '@/components/nav/Link.jsx';

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

	const viewingRecipe = hooks.useFindPeer((peer) => {
		return !!peer?.presence?.viewingRecipeId;
	});

	const recipeId = viewingRecipe?.presence.viewingRecipeId;

	if (recipeId && recipeId !== dismissedId) {
		return (
			<PageNowPlaying className="w-full pb-[env(safe-area-inset-bottom,0px)]">
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
		<div className="flex flex-row gap-2 items-center p-2">
			<Button size="small" onClick={onDismiss} color="ghost">
				<Cross2Icon />
			</Button>
			<PersonAvatar person={person} />
			<div className="flex flex-col gap-2px flex-[1_1_0] min-w-0">
				<div className="text-xxs">&nbsp;{person.profile.name} is cooking</div>
				<div className="text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap">
					{recipe.get('title')}
				</div>
			</div>
			<LinkButton
				size="small"
				to={makeRecipeLink(recipe, '/cook/prep')}
				className="whitespace-nowrap"
				onClick={onDismiss}
			>
				Join
			</LinkButton>
		</div>
	);
}
