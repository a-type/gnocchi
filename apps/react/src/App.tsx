import { AuthProvider } from '@/contexts/AuthContext.js';
import { ClaimInvitePage } from '@/pages/ClaimInvitePage.js';
import { GroceriesPage } from '@/pages/GroceriesPage.js';
import { NevermindPage } from '@/pages/NevermindPage.js';
import { NotFoundPage } from '@/pages/NotFoundPage.js';
import { trpc, trpcClient } from '@/trpc.js';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/primitives/ErrorBoundary.js';
import { PlanPage } from './pages/PlanPage.js';
import { Button, H1, P } from './components/primitives/index.js';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SplashPage } from './pages/SplashPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { RecipesPage } from './pages/RecipesPage.jsx';
import { RecipeEditPage } from './pages/RecipeEditPage.jsx';
import { StartSignupDialog } from './components/sync/StartSignupDialog.jsx';
import { PantryPage } from './pages/PantryPage.jsx';
import { NavBar } from './components/nav/NavBar.jsx';
import { UpdatePrompt } from './components/updatePrompt/UpdatePrompt.jsx';
import { Box } from './components/primitives/box/Box.jsx';
import { clsx } from 'clsx';
import * as classes from './App.css.js';
import { lemonTheme } from './styles/themes/lemon.css.js';
import { JoinPage } from './pages/JoinPage.jsx';

export function App() {
	const [queryClient] = useState(() => new QueryClient());

	useLayoutEffect(() => {
		if (typeof window !== 'undefined') {
			document.body.className = lemonTheme;
		}
	}, []);

	return (
		<div className={clsx(classes.wrapper, lemonTheme)}>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<TooltipProvider>
					<Suspense fallback="Loading...">
						<trpc.Provider client={trpcClient} queryClient={queryClient}>
							<QueryClientProvider client={queryClient}>
								<BrowserRouter>
									<AuthProvider>
										<Routes>
											<Route path="/" element={<GroceriesPage />} />
											<Route path="/list/:listId" element={<GroceriesPage />} />
											<Route path="/plan" element={<PlanPage />} />
											<Route
												path="/claim/:inviteId"
												element={<ClaimInvitePage />}
											/>
											<Route path="/purchased" element={<PantryPage />} />
											<Route
												path="/recipes/:slug"
												element={<RecipeEditPage />}
											/>
											<Route path="/recipes" element={<RecipesPage />} />
											<Route path="/nevermind" element={<NevermindPage />} />
											<Route path="/welcome" element={<SplashPage />} />
											<Route path="/join" element={<JoinPage />} />
											<Route path="/admin" element={<AdminPage />} />
											<Route path="*" element={<NotFoundPage />} />
										</Routes>
										<NavBar />
										<Toaster position="bottom-center" />
										<StartSignupDialog />
										<UpdatePrompt />
									</AuthProvider>
								</BrowserRouter>
							</QueryClientProvider>
						</trpc.Provider>
					</Suspense>
				</TooltipProvider>
			</ErrorBoundary>
		</div>
	);
}

function ErrorFallback() {
	return (
		<Box align="center" justify="center" p={4}>
			<Box align="flex-start" justify="center" gap={4} maxWidth="content">
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
