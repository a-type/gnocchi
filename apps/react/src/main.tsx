import { AuthProvider } from '@/contexts/AuthContext.js';
import { ClaimInvitePage } from '@/pages/ClaimInvitePage.js';
import { GroceriesPage } from '@/pages/GroceriesPage.js';
import { NevermindPage } from '@/pages/NevermindPage.js';
import { NotFoundPage } from '@/pages/NotFoundPage.js';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { globalCss } from '@/stitches.config.js';
import { PageContent, PageRoot } from './components/layouts/index.js';
import { attachToPwaEvents } from './pwaEventListener.js';
import { register } from './serviceWorkerRegistration.js';
import { Toaster } from 'react-hot-toast';

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
		backgroundColor: '$light',
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
			<BrowserRouter>
				<AuthProvider>
					<PageRoot>
						<PageContent fullHeight noPadding flex={1}>
							<Routes>
								<Route path="/" element={<GroceriesPage />} />
								<Route path="/claim/:inviteId" element={<ClaimInvitePage />} />
								<Route path="/nevermind" element={<NevermindPage />} />
								<Route path="*" element={<NotFoundPage />} />
							</Routes>
							<Toaster />
						</PageContent>
					</PageRoot>
				</AuthProvider>
			</BrowserRouter>
		</StrictMode>,
	);

	attachToPwaEvents();
}

main();

register();
