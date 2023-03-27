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
	ThemedPageRoot,
	TopControls,
	UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';
import { Box, PageContent } from '@aglio/ui';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function GroceriesPage() {
	const navigate = useNavigate();

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
	useNeverSeenBefore(start);

	return (
		<ListContext.Provider value={listId}>
			<RecipeSavePrompt />
			<ThemedPageRoot listId={listId}>
				<PageContent fullHeight noPadding nav>
					<TopControls>
						<ListSelectWrapper>
							<ListSelect includeAll value={listId} onChange={onListChange} />
							{listId && <ListEdit listId={listId} />}
						</ListSelectWrapper>

						<Box direction="row" gap={1} align="center">
							<UnsubscribedOnly>
								<PromoteSubscriptionButton size="small" color="accent">
									Upgrade
								</PromoteSubscriptionButton>
							</UnsubscribedOnly>
							<OfflineIndicator />
						</Box>
					</TopControls>
					<AddBar />
					<List />
					<SubscriptionExpiredDialog />
					<CompleteSignupDialog />
					<SignupSuccessBanner />
					<UnknownListRedirect listId={listId} />
				</PageContent>
				<RecipePresenceNotification />
			</ThemedPageRoot>
		</ListContext.Provider>
	);
}
