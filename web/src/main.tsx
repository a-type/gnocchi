import { start } from './stores/groceries';
import { createRoot } from 'react-dom/client';
import { PageContent, PageNowPlayingBar, PageRoot } from './components/layouts';
import GroceryList from './components/groceries/GroceryList';
import DeleteCheckedButton from './components/groceries/DeleteCheckedButton';
import { GroceryListAdd } from './components/groceries/GroceryListAdd';
import { Box } from './components/primitives';
import { GroceryListContext } from './contexts/GroceryListContext';
import React, { StrictMode } from 'react';
import { globalCss } from 'stitches.config';

async function main() {
	const data = await start();
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<GroceryListContext.Provider value={data}>
				<PageRoot>
					<PageContent fullHeight flex={1}>
						<h1>Groceries</h1>
						<GroceryList />
					</PageContent>
					<PageNowPlayingBar>
						<Box w="full" p={1} direction="column" gap={2} align="stretch">
							<DeleteCheckedButton />
							<GroceryListAdd />
						</Box>
					</PageNowPlayingBar>
				</PageRoot>
			</GroceryListContext.Provider>
		</StrictMode>,
	);
}

main();

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

	'#__next': {
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
