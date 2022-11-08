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
import { ErrorBoundary } from './components/primitives/ErrorBoundary.js';
import { API_HOST_HTTP } from './config.js';
import { PlanPage } from './pages/PlanPage.js';
import { Box, Button, H1, P } from './components/primitives/primitives.js';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SplashPage } from './pages/SplashPage.jsx';

export function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			url: `${API_HOST_HTTP}/trpc`,
		}),
	);

	return (
		<ErrorBoundary fallback={<ErrorFallback />}>
			<TooltipProvider>
				<Suspense fallback="Loading...">
					<trpc.Provider client={trpcClient} queryClient={queryClient}>
						<QueryClientProvider client={queryClient}>
							<BrowserRouter>
								<AuthProvider>
									<Routes>
										<Route path="/" element={<GroceriesPage />} />
										<Route path="/plan" element={<PlanPage />} />
										<Route
											path="/claim/:inviteId"
											element={<ClaimInvitePage />}
										/>
										<Route path="/nevermind" element={<NevermindPage />} />
										<Route path="/welcome" element={<SplashPage />} />
										<Route path="*" element={<NotFoundPage />} />
									</Routes>
									<Toaster />
								</AuthProvider>
							</BrowserRouter>
						</QueryClientProvider>
					</trpc.Provider>
				</Suspense>
			</TooltipProvider>
		</ErrorBoundary>
	);
}

function ErrorFallback() {
	return (
		<Box align="center" justify="center" p={4}>
			<Box align="start" justify="center" gap={4} css={{ maxWidth: 600 }}>
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed. You can try refreshing, but if
					that doesn't work,{' '}
					<a href="mailto:gaforres@gmail.com">let me know about it.</a>
				</P>
				<Button onClick={() => window.location.reload()}>Refresh</Button>
			</Box>
		</Box>
	);
}
