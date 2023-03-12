import GroceryList from '@/components/groceries/GroceryList.js';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.js';
import { CompleteSignupDialog } from '@/components/sync/CompleteSignupDialog.js';
import { SubscriptionExpiredDialog } from '@/components/sync/SubscriptionExpiredDialog.js';
import { ReactNode, Suspense, useCallback, useEffect } from 'react';
import { MainMenu } from '@/components/menu/MainMenu.js';
import { SignupSuccessBanner } from '@/components/sync/SignupSuccessBanner.js';
import { PageContent, PageFixedArea, PageRoot } from '@aglio/ui';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GroceriesActionBar } from '@/components/groceries/actions/GroceriesActionBar.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { Box } from '@aglio/ui';
import { ListContext } from '@/contexts/ListContext.jsx';
import { useListThemeClass } from '@/components/groceries/lists/hooks.js';
import { sprinkles } from '@aglio/ui';
import { ListEdit } from '@/components/groceries/lists/ListEdit.jsx';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';
import { RecipeSavePrompt } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { UnsubscribedOnly } from '@/components/auth/UnsubscribedOnly.jsx';
import { PromoteSubscriptionButton } from '@/components/promotional/PromoteSubscriptionButton.jsx';
import { hooks } from '@/stores/groceries/index.js';
import {
	AddBar,
	List,
	ListSelectWrapper,
	ThemedPageRoot,
	TopControls,
	UnknownListRedirect,
} from '@/pages/groceries/layout.jsx';

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

						<UnsubscribedOnly>
							<PromoteSubscriptionButton size="small" color="accent">
								Upgrade
							</PromoteSubscriptionButton>
						</UnsubscribedOnly>
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
