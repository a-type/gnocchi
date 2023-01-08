import { AuthProvider } from '@/contexts/AuthContext.js';
import { ClaimInvitePage } from '@/pages/ClaimInvitePage.js';
import { GroceriesPage } from '@/pages/GroceriesPage.js';
import { NevermindPage } from '@/pages/NevermindPage.js';
import { NotFoundPage } from '@/pages/NotFoundPage.js';
import { trpc, trpcClientOptions } from '@/trpc.js';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/primitives/ErrorBoundary.js';
import { PlanPage } from './pages/PlanPage.js';
import { Button, H1, P } from './components/primitives/index.js';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SplashPage } from './pages/SplashPage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { RecipesPage } from './pages/recipe/RecipesPage.jsx';
import { RecipeEditPage } from './pages/recipe/RecipeEditPage.jsx';
import { StartSignupDialog } from './components/sync/StartSignupDialog.jsx';
import { PantryPage } from './pages/PantryPage.jsx';
import { UpdatePrompt } from './components/updatePrompt/UpdatePrompt.jsx';
import { Box } from './components/primitives/box/Box.jsx';
import { clsx } from 'clsx';
import * as classes from './App.css.js';
import { lemonTheme } from './styles/themes/lemon.css.js';
import { JoinPage } from './pages/JoinPage.jsx';
import { VerifyEmailPage } from './pages/VerifyEmailPage.jsx';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage.jsx';
import { AdminFeatureFlagsPage } from './pages/admin/AdminFeatureFlagsPage.jsx';
import { LogoutNotice } from './components/auth/LogoutNotice.jsx';
import { RecipeViewPage } from './pages/recipe/RecipeViewPage.jsx';
import { AdminSyncPage } from './pages/admin/AdminSyncPage.jsx';
import { DomainChangeDialog } from './components/auth/DomainChangeDialog.jsx';
import { RecipeSavePrompt } from './components/recipes/savePrompt/RecipeSavePrompt.jsx';
import { RecipeCookPage } from './pages/recipe/RecipeCookPage.jsx';
import { RecipeOverviewPage } from './pages/recipe/RecipeOverviewPage.jsx';
import { SubscriberFeaturesPage } from './pages/SubscriberFeaturesPage.jsx';
import { hooks, groceriesDescriptor } from './stores/groceries/index.js';

export function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));

	useLayoutEffect(() => {
		if (typeof window !== 'undefined') {
			document.body.className = lemonTheme;
		}
	}, []);

	return (
		<div className={clsx(classes.wrapper, lemonTheme)}>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<TooltipProvider>
					<Suspense fallback={null}>
						<trpc.Provider client={trpcClient} queryClient={queryClient}>
							<QueryClientProvider client={queryClient}>
								<BrowserRouter>
									<AuthProvider>
										<hooks.Provider value={groceriesDescriptor}>
											<Routes>
												<Route path="/" element={<GroceriesPage />} />
												<Route
													path="/list/:listId"
													element={<GroceriesPage />}
												/>
												<Route path="/plan" element={<PlanPage />} />
												<Route
													path="/claim/:inviteId"
													element={<ClaimInvitePage />}
												/>
												<Route path="/purchased" element={<PantryPage />} />
												<Route path="/nevermind" element={<NevermindPage />} />
												<Route path="/welcome" element={<SplashPage />} />
												<Route path="/join" element={<JoinPage />} />
												<Route path="/verify" element={<VerifyEmailPage />} />
												<Route path="/admin" element={<AdminPage />}>
													<Route
														path="/admin/categories"
														element={<AdminCategoriesPage />}
													/>
													<Route
														path="/admin/feature-flags"
														element={<AdminFeatureFlagsPage />}
													/>
													<Route
														path="/admin/sync"
														element={<AdminSyncPage />}
													/>
												</Route>
												<Route
													path="/recipes/:slug"
													element={<RecipeViewPage />}
												>
													<Route
														path="/recipes/:slug"
														element={<RecipeOverviewPage />}
													/>
													<Route
														path="/recipes/:slug/edit"
														element={<RecipeEditPage />}
													/>
													<Route
														path="/recipes/:slug/cook"
														element={<RecipeCookPage />}
													/>
												</Route>
												<Route path="/recipes" element={<RecipesPage />} />
												<Route
													path="/subscriber-features"
													element={<SubscriberFeaturesPage />}
												/>
												<Route path="*" element={<NotFoundPage />} />
											</Routes>
											<Toaster position="bottom-center" />
											<StartSignupDialog />
											<UpdatePrompt />
											<LogoutNotice />
											<DomainChangeDialog />
											<RecipeSavePrompt />
										</hooks.Provider>
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
