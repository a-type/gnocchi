import { createRoot } from 'react-dom/client';
import { PageContent, PageRoot } from './components/layouts';
import GroceryList from './components/groceries/GroceryList';
import DeleteCheckedButton from './components/groceries/DeleteCheckedButton';
import { GroceryListAdd } from './components/groceries/GroceryListAdd';
import { Box } from './components/primitives';
import React, { StrictMode, Suspense } from 'react';
import { globalCss, css } from 'stitches.config';
import { register } from './serviceWorkerRegistration';
import { attachToPwaEvents } from './pwaEventListener';

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
					<Suspense>
						<GroceryList />
					</Suspense>
				</PageContent>
			</PageRoot>
		</StrictMode>,
	);

	attachToPwaEvents();
}

main();

register();
