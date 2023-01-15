import GroceryList from '@/components/groceries/GroceryList.js';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.js';
import { CompleteSignupDialog } from '@/components/sync/CompleteSignupDialog.js';
import { SubscriptionExpiredDialog } from '@/components/sync/SubscriptionExpiredDialog.js';
import { ReactNode, Suspense, useCallback, useEffect } from 'react';
import { MainMenu } from '@/components/menu/MainMenu.js';
import { SignupSuccessBanner } from '@/components/sync/SignupSuccessBanner.js';
import {
	PageContent,
	PageFixedArea,
	PageRoot,
} from '@/components/layouts/index.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useNavigate, useParams } from 'react-router-dom';
import { GroceriesActionBar } from '@/components/groceries/actions/GroceriesActionBar.jsx';
import { ListSelect } from '@/components/groceries/lists/ListSelect.jsx';
import { Box } from '@/components/primitives/box/Box.jsx';
import { ListContext } from '@/contexts/ListContext.jsx';
import { useListThemeClass } from '@/components/groceries/lists/hooks.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { ListEdit } from '@/components/groceries/lists/ListEdit.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { RecipePresenceNotification } from '@/components/sync/collaborationMenu/RecipePresenceNotification.jsx';
import { RecipeSavePrompt } from '@/components/recipes/savePrompt/RecipeSavePrompt.jsx';

export function GroceriesPage() {
	const [hasSeenWelcome] = useLocalStorage('hasSeenWelcome', false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasSeenWelcome) {
			navigate('/welcome');
		}
	}, [hasSeenWelcome]);

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
					<Box
						width="full"
						flexDirection="row"
						justify="space-between"
						align="center"
						gap={2}
						px={4}
						py={2}
						mt={1}
					>
						{/* Suspended state approximates final height */}
						<Box flexDirection="row" align="center" gap={2}>
							<Suspense fallback={<div style={{ height: 28 }} />}>
								<ListSelect includeAll value={listId} onChange={onListChange} />
								{listId && <ListEdit listId={listId} />}
							</Suspense>
						</Box>
					</Box>
					<PageFixedArea
						className={sprinkles({
							display: 'flex',
							flexDirection: 'column',
							gap: 2,
							p: 2,
						})}
					>
						<Suspense fallback={<div style={{ height: 41 }} />}>
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
				</PageContent>
				<RecipePresenceNotification />
			</ThemedPageRoot>
		</ListContext.Provider>
	);
}

function ThemedPageRoot({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string | null | undefined;
}) {
	return (
		<Suspense fallback={<PageRoot>{children}</PageRoot>}>
			<ThemedPageRootInner listId={listId}>{children}</ThemedPageRootInner>
		</Suspense>
	);
}

function ThemedPageRootInner({
	children,
	listId,
}: {
	children: ReactNode;
	listId: string | null | undefined;
}) {
	const theme = useListThemeClass(listId);

	return (
		<Suspense fallback={children}>
			<PageRoot className={theme}>{children}</PageRoot>
		</Suspense>
	);
}
