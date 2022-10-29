import DeleteCheckedButton from '@/components/groceries/DeleteCheckedButton.js';
import GroceryList from '@/components/groceries/GroceryList.js';
import { GroceryListAdd } from '@/components/groceries/GroceryListAdd.js';
import { Box } from '@/components/primitives/primitives.js';
import { CompleteSignupDialog } from '@/components/sync/CompleteSignupDialog.js';
import { SubscriptionExpiredDialog } from '@/components/sync/SubscriptionExpiredDialog.js';
import { SyncMenu } from '@/components/sync/SyncMenu.js';
import React, { Suspense } from 'react';
import { MainMenu } from '@/components/menu/MainMenu.js';
import { SignupSuccessBanner } from '@/components/sync/SignupSuccessBanner.js';
import { styled } from '@/stitches.config.js';

export function GroceriesPage() {
	return (
		<>
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
				<PositionedDeleteChecked />
			</Box>
			<Suspense fallback={null}>
				<GroceryList />
			</Suspense>
			<SubscriptionExpiredDialog />
			<CompleteSignupDialog />
			<SignupSuccessBanner />
		</>
	);
}

const PositionedDeleteChecked = styled(DeleteCheckedButton, {
	position: 'absolute !important',
	left: '50%',
	bottom: '-20px',
	transform: 'translate(-50%, 50%)',
});
