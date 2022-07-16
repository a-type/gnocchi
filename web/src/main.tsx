import { createRoot } from 'react-dom/client';
import { PageContent, PageNowPlayingBar, PageRoot } from './components/layouts';
import GroceryList from './components/groceries/GroceryList';
import DeleteCheckedButton from './components/groceries/DeleteCheckedButton';
import { GroceryListAdd } from './components/groceries/GroceryListAdd';
import { Box } from './components/primitives';
import React, { StrictMode, Suspense } from 'react';
import { globalCss, css } from 'stitches.config';
import { register } from './serviceWorkerRegistration';

const floatingButton = css({
	position: 'absolute',
	left: '50%',
	bottom: '-20px',
	transform: 'translate(-50%, 50%)',
});

function main() {
	const root = createRoot(document.getElementById('root')!);
	root.render(
		<StrictMode>
			<PageRoot>
				<PageContent fullHeight noPadding flex={1}>
					<Suspense fallback={<div>Loading...</div>}>
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
							<Suspense fallback={null}>
								<DeleteCheckedButton className={floatingButton()} />
							</Suspense>
						</Box>
						<GroceryList />
					</Suspense>
				</PageContent>
			</PageRoot>
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
