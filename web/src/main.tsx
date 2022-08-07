import { start } from './stores/groceries';
import { createRoot } from 'react-dom/client';
import { PageContent, PageNowPlayingBar, PageRoot } from './components/layouts';
import GroceryList from './components/groceries/GroceryList';
import DeleteCheckedButton from './components/groceries/DeleteCheckedButton';
import { GroceryListAdd } from './components/groceries/GroceryListAdd';
import { Box } from './components/primitives';
import { GroceryListContext } from './contexts/GroceryListContext';
import React, { StrictMode } from 'react';
import { globalCss, css } from 'stitches.config';
import { register } from './serviceWorkerRegistration';
import { SyncMenu } from 'components/sync/SyncMenu';
import { AuthProvider } from 'contexts/AuthContext';

async function main() {
	const data = await start();
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<GroceryListContext.Provider value={data}>
				<PageRoot>
					<PageContent fullHeight noPadding flex={1}>
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
						<GroceryList />
					</PageContent>
				</PageRoot>
			</GroceryListContext.Provider>
		</StrictMode>,
	);
}

main();

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

register();
