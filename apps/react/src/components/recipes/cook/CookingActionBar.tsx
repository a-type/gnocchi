import { Icon } from '@/components/icons/Icon.jsx';
import { TextLink } from '@/components/nav/Link.jsx';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { useActiveCookingSession } from '@/components/recipes/hooks.js';
import { InviteLinkButton } from '@/components/sync/InviteLinkButton.jsx';
import {
	PeopleList,
	PeopleListItem,
} from '@/components/sync/people/People.jsx';
import { PersonAvatar } from '@/components/sync/people/PersonAvatar.jsx';
import { PRICE_MONTHLY_DOLLARS } from '@/config.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { hooks } from '@/stores/groceries/index.js';
import { trpc } from '@/trpc.js';
import { Recipe } from '@aglio/groceries-client';
import { ActionBar, ActionButton } from '@a-type/ui/components/actions';
import { Button } from '@a-type/ui/components/button';
import {
	Dialog,
	DialogActions,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@a-type/ui/components/dialog';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface CookingActionBarProps {
	recipe: Recipe;
}

export function CookingActionBar({ recipe }: CookingActionBarProps) {
	return (
		<ActionBar>
			<CookingPeople recipeId={recipe.get('id')} />
			<AddChefsAction />
			<StopCookingAction recipe={recipe} />
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

function AddChefsAction() {
	const { data: auth } = useAuth();
	const { data: members } = trpc.plan.members.useQuery(undefined, {
		enabled: !!auth?.session,
	});
	const isSubscribed = auth?.isSubscribed;
	const showTip = auth && (!auth?.session || members?.length === 1);
	const [dismissed, setDismissed] = useLocalStorage('add-chefs-tip', false);

	const showSubscribe = !auth?.session || !isSubscribed;

	return (
		<Dialog
			onOpenChange={(open) => {
				if (!open) setDismissed(true);
			}}
		>
			<DialogTrigger asChild>
				<ActionButton
					visible={showTip && !dismissed}
					icon={<Icon name="add_person" />}
					color="accent"
				>
					<span className="display-none sm:display-inline">Invite chefs</span>
				</ActionButton>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Invite chefs</DialogTitle>
				{showSubscribe ? (
					<>
						<p>
							Subscribe to invite others to help you cook! Recipe progress is
							shared for all plan members in real-time. You can have as many
							people on your plan as you like.
						</p>
						<p>
							Plus, subscribers get a whole lot of other features, including
							device sync, grocery collaboration, and web recipe scanning.
						</p>
						<p>
							<TextLink newTab to="/welcome?upgrade=true">
								Learn more about subscription features.
							</TextLink>
						</p>
					</>
				) : (
					<p>
						Invite people to your plan to cook together! Recipe progress is
						shared for all plan members in real-time.
					</p>
				)}
				<DialogActions>
					<DialogClose asChild>
						<Button align="start">Dismiss</Button>
					</DialogClose>
					{showSubscribe ? (
						<PromoteSubscriptionButton className="">
							Subscribe for ${PRICE_MONTHLY_DOLLARS}/month
						</PromoteSubscriptionButton>
					) : (
						<InviteLinkButton color="primary" />
					)}
				</DialogActions>
			</DialogContent>
		</Dialog>
	);
}

function StopCookingAction({ recipe }: { recipe: Recipe }) {
	const session = useActiveCookingSession(recipe);
	const stopCooking = () => {
		recipe.set('session', null);
	};

	return (
		<ActionButton
			visible={!!session}
			icon={<Cross2Icon />}
			onClick={stopCooking}
		>
			Stop cooking
		</ActionButton>
	);
}
