import {
	PeopleList,
	PeopleListItem,
} from '@/components/sync/people/People.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { ActionBar } from '@aglio/ui/components/actions';
import { ErrorBoundary } from '@aglio/ui/components/errorBoundary';

export interface CookingActionBarProps {
	recipe: Recipe;
}

export function CookingActionBar({ recipe }: CookingActionBarProps) {
	return (
		<ActionBar>
			<CookingPeople recipeId={recipe.get('id')} />
		</ActionBar>
	);
}

function CookingPeople({ recipeId }: { recipeId: string }) {
	const self = hooks.useSelf();
	const peers = hooks.useFindPeers(
		(peer) => peer.presence.viewingRecipeId === recipeId,
	);

	const syncing = hooks.useSyncStatus();

	if (!syncing || peers.length === 0) {
		return null;
	}

	return (
		<ErrorBoundary>
			<PeopleList count={peers.length + 1}>
				<PeopleListItem index={0}>
					<PersonAvatar person={self} />
				</PeopleListItem>
				{peers.map((peer, index) => (
					<PeopleListItem index={index + 1} key={peer.id}>
						<PersonAvatar person={peer} />
					</PeopleListItem>
				))}
			</PeopleList>
		</ErrorBoundary>
	);
}