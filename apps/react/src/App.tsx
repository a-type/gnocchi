import { AuthProvider } from '@/contexts/AuthContext.js';
import { ClaimInvitePage } from '@/pages/ClaimInvitePage.js';
import { GroceriesPage } from '@/pages/GroceriesPage.js';
import { NevermindPage } from '@/pages/NevermindPage.js';
import { NotFoundPage } from '@/pages/NotFoundPage.js';
import { trpc } from '@/trpc.js';
import React, { Suspense, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageContent, PageRoot } from './components/layouts/index.js';
import { API_HOST_HTTP } from './config.js';
import { PlanPage } from './pages/PlanPage.js';

export function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			url: `${API_HOST_HTTP}/trpc`,
		}),
	);

	return (
		<Suspense fallback="Loading...">
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<AuthProvider>
							<PageRoot>
								<PageContent fullHeight noPadding flex={1}>
									<Routes>
										<Route path="/" element={<GroceriesPage />} />
										<Route path="/plan" element={<PlanPage />} />
										<Route
											path="/claim/:inviteId"
											element={<ClaimInvitePage />}
										/>
										<Route path="/nevermind" element={<NevermindPage />} />
										<Route path="*" element={<NotFoundPage />} />
									</Routes>
									<Toaster />
								</PageContent>
							</PageRoot>
						</AuthProvider>
					</BrowserRouter>
				</QueryClientProvider>
			</trpc.Provider>
		</Suspense>
	);
}
