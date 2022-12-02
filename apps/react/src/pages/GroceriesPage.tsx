import GroceryList from '@/components/groceries/GroceryList.js';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.js';
import { CompleteSignupDialog } from '@/components/sync/CompleteSignupDialog.js';
import { SubscriptionExpiredDialog } from '@/components/sync/SubscriptionExpiredDialog.js';
import { Suspense, useCallback, useEffect } from 'react';
import { MainMenu } from '@/components/menu/MainMenu.js';
import { SignupSuccessBanner } from '@/components/sync/SignupSuccessBanner.js';
import { groceriesDescriptor, hooks } from '@/stores/groceries/index.js';
import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@/components/layouts/index.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useNavigate, useParams } from 'react-router-dom';
import { GroceriesActionBar } from '@/components/groceries/actions/GroceriesActionBar.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { CollaborationMenu } from '@/components/sync/collaborationMenu/CollaborationMenu.jsx';
import { Box } from '@/components/primitives/box/Box.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';

export function GroceriesPage() {
	const [hasSeenWelcome] = useLocalStorage('hasSeenWelcome', false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasSeenWelcome) {
			navigate('/welcome');
		}
	}, [hasSeenWelcome]);

	const onListChange = useCallback(
		(listId: string | null) => {
			if (listId === null) {
				navigate('/');
			} else {
				navigate(`/list/${listId}`);
			}
		},
		[navigate],
	);
	const { listId = null } = useParams();

	return (
		<ListContext.Provider value={listId}>
			<PageRoot>
				<PageContent fullHeight noPadding>
					<hooks.Provider value={groceriesDescriptor}>
						<Box
							width="full"
							flexDirection="row"
							justify="space-between"
							align="center"
							gap={2}
							p={4}
						>
							<Suspense fallback={null}>
								<Box flexDirection="row" align="center" gap={2}>
									<MainMenu />
									<ListSelect value={listId} onChange={onListChange} />
								</Box>
								<CollaborationMenu />
							</Suspense>
						</Box>
						<PageFixedArea>
							<Suspense fallback={null}>
								<GroceryListAdd />
							</Suspense>
							<GroceriesActionBar />
						</PageFixedArea>
						<Suspense fallback={null}>
							<GroceryList />
						</Suspense>
						<SubscriptionExpiredDialog />
						<CompleteSignupDialog />
						<SignupSuccessBanner />
					</hooks.Provider>
				</PageContent>
			</PageRoot>
		</ListContext.Provider>
	);
}
