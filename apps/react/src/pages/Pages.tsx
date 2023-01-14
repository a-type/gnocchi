import { lazy, Suspense } from 'react';
import {
	createBrowserRouter,
	Outlet,
	Route,
	RouterProvider,
	Routes,
	useMatches,
} from 'react-router-dom';
import { GroceriesPage } from './GroceriesPage.jsx';
import { PantryPage } from './PantryPage.jsx';
import { NotFoundPage } from './NotFoundPage.jsx';
import {
	NavContextProvider,
	NowPlayingProvider,
	PageContent,
	PageNav,
	PageRoot,
} from '@/components/layouts/index.jsx';
import { atom, useAtomValue } from 'jotai';
import { ThemeName } from '@/components/primitives/index.js';
import RecipesPage from './recipe/RecipesPage.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { VerifyPasswordResetPage } from './VerifyPasswordReset.jsx';
import { StartSignupDialog } from '@/components/sync/StartSignupDialog.jsx';
import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { DomainChangeDialog } from '@/components/auth/DomainChangeDialog.jsx';
import { LogoutNotice } from '@/components/auth/LogoutNotice.jsx';

const PlanPage = lazy(() => import('./PlanPage.jsx'));
const ClaimInvitePage = lazy(() => import('./ClaimInvitePage.jsx'));
const NevermindPage = lazy(() => import('./NevermindPage.jsx'));
const SplashPage = lazy(() => import('./SplashPage.jsx'));
const JoinPage = lazy(() => import('./JoinPage.jsx'));
const VerifyEmailPage = lazy(() => import('./VerifyEmailPage.jsx'));
const AdminPage = lazy(() => import('./AdminPage.jsx'));
const AdminCategoriesPage = lazy(
	() => import('./admin/AdminCategoriesPage.jsx'),
);
const AdminPlanManagerPage = lazy(
	() => import('./admin/AdminPlanManagerPage.js'),
);
const AdminSyncPage = lazy(() => import('./admin/AdminSyncPage.jsx'));
const RecipeViewPage = lazy(() => import('./recipe/RecipeViewPage.jsx'));
const RecipeEditPage = lazy(() => import('./recipe/RecipeEditPage.jsx'));
const RecipeCookPage = lazy(() => import('./recipe/RecipeCookPage.jsx'));
const RecipeOverviewPage = lazy(
	() => import('./recipe/RecipeOverviewPage.jsx'),
);
const SubscriberFeaturesPage = lazy(
	() => import('./SubscriberFeaturesPage.jsx'),
);

const router = createBrowserRouter([
	{
		element: <PageLayoutRoot />,
		hasErrorBoundary: false,
		children: [
			{
				path: '/',
				element: <GroceriesPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/settings',
				element: <PlanPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/claim/:inviteId',
				element: <ClaimInvitePage />,
				handle: { nav: false },
				hasErrorBoundary: false,
			},
			{
				path: '/purchased',
				element: <PantryPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/nevermind',
				element: <NevermindPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/welcome',
				element: <SplashPage />,
				handle: { nav: false },
				hasErrorBoundary: false,
			},
			{
				path: '/join',
				element: <JoinPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/verify',
				element: <VerifyEmailPage />,
				handle: { nav: false },
				hasErrorBoundary: false,
			},
			{
				path: '/admin',
				element: <AdminPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
				children: [
					{
						path: 'categories',
						element: <AdminCategoriesPage />,
						hasErrorBoundary: false,
					},
					{
						path: 'plans',
						element: <AdminPlanManagerPage />,
						hasErrorBoundary: false,
					},
					{
						path: 'sync',
						element: <AdminSyncPage />,
					},
				],
			},
			{
				path: '/recipes',
				element: <RecipesPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/recipes/:slug',
				element: <RecipeViewPage />,
				handle: { nav: true },
				children: [
					{
						index: true,
						element: <RecipeOverviewPage />,
					},
					{
						path: 'edit',
						element: <RecipeEditPage />,
					},
					{
						path: 'cook',
						element: <RecipeCookPage />,
					},
				],
				hasErrorBoundary: false,
			},
			{
				path: '/subscriber-features',
				element: <SubscriberFeaturesPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/reset-password',
				element: <VerifyPasswordResetPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '*',
				element: <NotFoundPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
		],
	},
]);

export function Pages() {
	return (
		<NowPlayingProvider>
			<NavContextProvider>
				<Suspense>
					<RouterProvider router={router} />
				</Suspense>
			</NavContextProvider>
		</NowPlayingProvider>
	);
}

function PageLayoutRoot() {
	const matches = useMatches();
	const showNav = matches.some((match) => (match.handle as any)?.nav);

	return (
		<>
			<Suspense
				fallback={
					<PageRoot>
						<PageContent />
					</PageRoot>
				}
			>
				<Outlet />
				<StartSignupDialog />
				<UpdatePrompt />
				<LogoutNotice />
				<DomainChangeDialog />
			</Suspense>
			{showNav && <NavBar />}
		</>
	);
}
