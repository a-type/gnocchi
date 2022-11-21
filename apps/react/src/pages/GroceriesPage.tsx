import DeleteCheckedButton from '@/components/groceries/DeleteCheckedButton.js';
import GroceryList from '@/components/groceries/GroceryList.js';
import { GroceryListAdd } from '@/components/groceries/addBar/GroceryListAdd.js';
import { Box } from '@/components/primitives/primitives.js';
import { CompleteSignupDialog } from '@/components/sync/CompleteSignupDialog.js';
import { SubscriptionExpiredDialog } from '@/components/sync/SubscriptionExpiredDialog.js';
import { SyncMenu } from '@/components/sync/SyncMenu.js';
import React, { Suspense, useEffect } from 'react';
import { MainMenu } from '@/components/menu/MainMenu.js';
import { SignupSuccessBanner } from '@/components/sync/SignupSuccessBanner.js';
import { styled } from '@/stitches.config.js';
import { groceriesDescriptor, hooks } from '@/stores/groceries/index.js';
import { PageContent, PageRoot } from '@/components/layouts/index.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { useNavigate } from 'react-router-dom';

export function GroceriesPage() {
	const [hasSeenWelcome] = useLocalStorage('hasSeenWelcome', false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!hasSeenWelcome) {
			navigate('/welcome');
		}
	}, [hasSeenWelcome]);

	return (
		<PageRoot>
			<PageContent fullHeight noPadding flex={1}>
				<hooks.Provider value={groceriesDescriptor}>
					<Box w="full" direction="row" align="center" gap={2} p={4}>
						<Suspense fallback={null}>
							<MainMenu />
							<SyncMenu />
						</Suspense>
					</Box>
					<Box
						w="full"
						p={4}
						direction="column"
						gap={2}
						align="stretch"
						css={{
							position: 'sticky',
							top: 0,
							zIndex: 1,
							backgroundColor: '$light',
							mb: '$6',
						}}
					>
						<GroceryListAdd />
						<Suspense fallback={null}>
							<PositionedDeleteChecked />
						</Suspense>
					</Box>
					<Suspense fallback={null}>
						<GroceryList />
					</Suspense>
					<SubscriptionExpiredDialog />
					<CompleteSignupDialog />
					<SignupSuccessBanner />
				</hooks.Provider>
			</PageContent>
		</PageRoot>
	);
}

const PositionedDeleteChecked = styled(DeleteCheckedButton, {
	position: 'absolute !important',
	left: '50%',
	bottom: '-20px',
	transform: 'translate(-50%, 50%)',
});
