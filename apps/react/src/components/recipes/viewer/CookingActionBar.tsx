import { ActionBar } from '@/components/primitives/actions/ActionBar.jsx';
import { ActionButton } from '@/components/primitives/actions/ActionButton.jsx';
import { ErrorBoundary } from '@/components/primitives/ErrorBoundary.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { hooks } from '@/stores/groceries/index.js';
import { Recipe } from '@aglio/groceries-client';
import { ResetIcon } from '@radix-ui/react-icons';
import * as classes from './CookingActionBar.css.js';

export interface CookingActionBarProps {
	recipe: Recipe;
}

export function CookingActionBar({ recipe }: CookingActionBarProps) {
	const resetAll = () => {
		recipe.set('session', {});
	};

	return (
		<ActionBar>
			<CookingPeople recipeId={recipe.get('id')} />
			<ActionButton onClick={resetAll} icon={<ResetIcon />}>
				Reset Progress
			</ActionButton>
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
			<div className={classes.peopleList}>
				<PersonAvatar person={self} index={0} />
				{peers.map((peer, index) => (
					<PersonAvatar person={peer} index={index + 1} key={peerk.id} />
				))}
			</div>
		</ErrorBoundary>
	);
}
