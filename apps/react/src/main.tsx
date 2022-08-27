import { createRoot } from 'react-dom/client';
import { PageContent, PageRoot } from './components/layouts/index.js';
import GroceryList from './components/groceries/GroceryList.js';
import DeleteCheckedButton from './components/groceries/DeleteCheckedButton.js';
import { GroceryListAdd } from './components/groceries/GroceryListAdd.js';
import { Box } from './components/primitives/index.js';
import React, { StrictMode, Suspense } from 'react';
import { globalCss, css } from 'stitches.config.js';
import { register } from './serviceWorkerRegistration.js';
import { attachToPwaEvents } from './pwaEventListener.js';
import { AuthProvider } from 'contexts/AuthContext.js';
import { SyncMenu } from 'components/sync/SyncMenu.js';

const floatingButton = css({
	position: 'absolute',
	left: '50%',
	bottom: '-20px',
	transform: 'translate(-50%, 50%)',
});

globalCss({
	'html, body': {
		margin: 0,
		padding: 0,
		fontFamily: '$sans',
		fontSize: '18px',
		height: '100%',
	},

	body: {
		height: '100%',
	},

	'#root': {
		display: 'flex',
		flexDirection: 'column',
		minHeight: '100%',
	},

	a: {
		color: 'inherit',
		textDecoration: 'none',
	},

	'*': {
		boxSizing: 'border-box',
	},
})();

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<AuthProvider>
				<PageRoot>
					<PageContent fullHeight noPadding flex={1}>
						<SyncMenu />
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
								backgroundColor: '$white',
								mb: '$6',
							}}
						>
							<GroceryListAdd />
							<DeleteCheckedButton className={floatingButton()} />
						</Box>
						<Suspense>
							<GroceryList />
						</Suspense>
					</PageContent>
				</PageRoot>
			</AuthProvider>
		</StrictMode>,
	);

	attachToPwaEvents();
}

main();

register();
