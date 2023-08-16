import { UnsubscribedOnly } from '@/components/auth/UnsubscribedOnly.jsx';
import { ListEdit } from '@/components/groceries/lists/ListEdit.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { RecipeSavePrompt } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { CompleteSignupDialog } from '@/components/sync/CompleteSignupDialog.js';
import { OfflineIndicator } from '@/components/sync/OfflineIndicator.jsx';
import { SignupSuccessBanner } from '@/components/sync/SignupSuccessBanner.js';
import { SubscriptionExpiredDialog } from '@/components/sync/SubscriptionExpiredDialog.js';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { useNeverSeenBefore } from '@/hooks/useNeverSeenBefore.js';
import { firstTimeOnboarding } from '@/onboarding/firstTimeOnboarding.js';
import {
	AddBar,
	List,
	ListSelectWrapper,
	ThemedPageContent,
	TopControls,
	UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';
import { useCallback, useEffect } from 'react';
import {
	useNavigate,
	useParams,
	useSearchParams,
} from '@verdant-web/react-router';
import { SubscribedOnly } from '@/components/auth/SubscribedOnly.jsx';
import { InviteLinkButton } from '@/components/sync/InviteLinkButton.jsx';
import { PersonIcon } from '@radix-ui/react-icons';
import { Icon } from '@/components/icons/Icon.jsx';
import { usePageTitle } from '@/hooks/usePageTitle.jsx';
import { InstallButton } from '@/components/promotional/InstallButton.jsx';

export function GroceriesPage() {
	const navigate = useNavigate();

	usePageTitle('Groceries');

	const onListChange = useCallback(
		(listId: string | null | undefined) => {
			if (listId === undefined) {
				navigate('/');
			} else if (listId === null) {
				navigate('/list/null');
			} else {
				navigate(`/list/${listId}`);
			}
		},
		[navigate],
	);
	const { listId: listIdParam } = useParams();
	const listId = listIdParam === 'null' ? null : listIdParam;

	const start = firstTimeOnboarding.useBegin();
	useEffect(() => {
		start();
	}, [start]);

	return (
		<ListContext.Provider value={listId}>
			<RecipeSavePrompt />
			<ThemedPageContent listId={listId}>
				<TopControls>
					<ListSelectWrapper>
						<ListSelect includeAll value={listId} onChange={onListChange} />
						{listId && <ListEdit listId={listId} />}
					</ListSelectWrapper>

					<div className="flex flex-row gap-2 items-center">
						<InstallButton />
						<UnsubscribedOnly>
							<PromoteSubscriptionButton size="small" color="accent">
								Upgrade
							</PromoteSubscriptionButton>
						</UnsubscribedOnly>
						<SubscribedOnly>
							<InviteLinkButton
								size="icon"
								color="ghost"
								className="opacity-70"
							>
								<Icon name="add_person" />
							</InviteLinkButton>
						</SubscribedOnly>
						<OfflineIndicator />
					</div>
				</TopControls>
				<AddBar />
				<List />
				<SubscriptionExpiredDialog />
				<CompleteSignupDialog />
				<SignupSuccessBanner />
				<UnknownListRedirect listId={listId} />
				<RecipePresenceNotification />
			</ThemedPageContent>
		</ListContext.Provider>
	);
}
