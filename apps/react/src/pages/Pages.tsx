import { LogoutNotice } from '@/components/auth/LogoutNotice.jsx';
import { SubscribedOnly } from '@/components/auth/SubscribedOnly.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { LinkButton } from '@/components/nav/Link.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { TopLoader } from '@/components/nav/TopLoader.jsx';
import { ResetToServer } from '@/components/sync/ResetToServer.jsx';
import { StartSignupDialog } from '@/components/sync/StartSignupDialog.jsx';
import {
	updateApp,
	updateState,
} from '@/components/updatePrompt/updateState.js';
import { GlobalLoader } from '@/GlobalLoader.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { Button } from '@a-type/ui/components/button';
import { H1, P } from '@a-type/ui/components/typography';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import {
	makeRoutes,
	Outlet,
	Router,
	useNextMatchingRoute,
} from '@verdant-web/react-router';
import { lazy, Suspense, useCallback } from 'react';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { GroceriesPage } from './groceries/GroceriesPage.js';
import { NotFoundPage } from './NotFoundPage.jsx';
import { RecipeTagEditor } from '@/components/recipes/tags/RecipeTagEditor.jsx';
import { SwipeOutlet } from '@/components/nav/SwipeOutlet.jsx';
import { PageRoot } from '@a-type/ui/components/layouts';
import { useMediaQuery } from '@/hooks/useMediaQuery.js';
import { FoodDetailDialog } from '@/components/foods/FoodDetailDialog.jsx';
import AdminChangelogPage from '@/pages/admin/AdminChangelogPage.jsx';
import {
	ReloadButton,
	useHadRecentError,
} from '@/components/sync/ReloadButton.jsx';

const PlanPage = lazyWithPreload(() => import('./PlanPage.jsx'));
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
const AdminFoodsPage = lazy(() => import('./admin/AdminFoodsPage.jsx'));
const RecipeViewPage = lazyWithPreload(
	() => import('./recipe/RecipeViewPage.jsx'),
);
const RecipeEditPage = lazyWithPreload(
	() => import('./recipe/RecipeEditPage.jsx'),
);
const RecipeOverviewPage = lazyWithPreload(
	() => import('./recipe/RecipeOverviewPage.jsx'),
);
const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicy.jsx'));
const TermsAndConditionsPage = lazy(() => import('./TermsAndConditions.jsx'));
const TempAccessGroceriesPage = lazy(
	() => import('./groceries/TempAccessGroceriesPage.jsx'),
);
const PantryPage = lazyWithPreload(() => import('./pantry/PantryPage.js'));
const PantryListPage = lazyWithPreload(
	() => import('./pantry/PantryListPage.js'),
);
const PantrySearchPage = lazyWithPreload(
	() => import('./pantry/PantrySearchPage.js'),
);
const RecipesPage = lazyWithPreload(() => import('./recipe/RecipesPage.jsx'));
const VerifyPasswordResetPage = lazy(() => import('./VerifyPasswordReset.jsx'));

function scrollToTop() {
	window.scrollTo(0, 0);
}

const routes = makeRoutes([
	{
		path: '/temp/:code/:listId',
		component: TempAccessGroceriesPage,
	},
	{
		path: '/temp/:code',
		component: TempAccessGroceriesPage,
	},
	{
		path: '/reset-password',
		component: VerifyPasswordResetPage,
	},
	{
		path: '/claim/:inviteId',
		component: ClaimInvitePage,
	},
	{
		path: '/welcome',
		component: SplashPage,
	},
	{
		path: '/',
		component: LayoutWithNavBar,
		children: [
			{
				index: true,
				component: GroceriesPage,
				onVisited: () => {
					PantryPage.preload();
					PantryListPage.preload();
					PlanPage.preload();
					RecipesPage.preload();
				},
				data: {
					right: '/pantry',
				},
			},
			{
				path: 'list/:listId',
				component: GroceriesPage,
			},
			{
				path: 'settings',
				component: PlanPage,
				data: {
					left: '/recipes',
				},
			},
			{
				path: 'pantry',
				component: PantryPage,
				onVisited: () => {
					RecipesPage.preload();
					PantryListPage.preload();
					PantrySearchPage.preload();
				},
				data: {
					left: '/',
					right: '/recipes',
				},
				children: [
					{
						index: true,
						component: PantryListPage,
					},
					{
						path: 'search',
						component: PantrySearchPage,
					},
				],
			},
			{
				path: 'nevermind',
				component: NevermindPage,
			},
			{
				path: 'join',
				component: JoinPage,
			},
			{
				path: 'verify',
				component: VerifyEmailPage,
			},
			{
				path: 'admin',
				component: AdminPage,

				children: [
					{
						path: 'categories',
						component: AdminCategoriesPage,
					},
					{
						path: 'plans',
						component: AdminPlanManagerPage,
					},
					{
						path: 'sync',
						component: AdminSyncPage,
					},
					{
						path: 'foods',
						component: AdminFoodsPage,
					},
					{
						path: 'changelog',
						component: AdminChangelogPage,
					},
				],
			},
			{
				path: 'recipes',
				exact: true,
				component: RecipesPage,
				onVisited: () => {
					RecipeViewPage.preload();
					RecipeOverviewPage.preload();
					PantryPage.preload();
					PantryListPage.preload();
				},
				data: {
					left: '/pantry',
					right: '/settings',
				},
			},
			{
				path: 'recipes/:slug',
				component: RecipeViewPage,
				onVisited: () => {
					RecipeEditPage.preload();
				},
				data: {
					left: '/pantry',
					right: '/settings',
				},
				children: [
					{
						path: '',
						exact: true,
						component: RecipeOverviewPage,
					},
					{
						path: 'edit',
						component: RecipeEditPage,
					},
					{
						// legacy path
						path: 'cook',
						component: RecipeOverviewPage,
					},
				],
			},
			{
				path: 'privacy-policy',
				component: PrivacyPolicyPage,
			},
			{
				path: 'tos',
				component: TermsAndConditionsPage,
			},
			{
				path: '',
				component: NotFoundPage,
			},
		],
	},
]);

function LayoutWithNavBar() {
	const big = useMediaQuery('(min-width: 640px)');
	if (big) {
		return (
			<PageRoot>
				<Outlet />
				<NavBar />
			</PageRoot>
		);
	}
	return (
		<PageRoot>
			<SwipeOutlet scroll className="[grid-area:content]" />
			<NavBar />
		</PageRoot>
	);
}

export function Pages() {
	const handleNavigate = useCallback(
		(_path: string, ev: { state?: any; skipTransition?: boolean }) => {
			if (updateState.updateAvailable) {
				console.info('Update ready to install, intercepting navigation...');
				updateApp(ev?.state?.isSwipeNavigation);
				return false;
			}
		},
		[],
	);
	return (
		<ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
			<Suspense fallback={<GlobalLoader />}>
				<Router routes={routes} onNavigate={handleNavigate}>
					<TopLoader />
					<Outlet />
					<StartSignupDialog />
					<LogoutNotice />
					<RecipeTagEditor />
					<FoodDetailDialog />
				</Router>
			</Suspense>
		</ErrorBoundary>
	);
}

function ErrorFallback({ clearError }: { clearError: () => void }) {
	const isSubscribed = useIsSubscribed();
	const hadRecentError = useHadRecentError();

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-start justify-center gap-4 max-w-content">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed.{' '}
					{hadRecentError
						? `Looks like refreshing didn't work either... I recommend reporting a bug using the button below.`
						: `You can try refreshing, but if
					that doesn't work, use the button below to report the issue.`}
				</P>
				<LinkButton to="/" onClick={clearError}>
					Go Home
				</LinkButton>
				<ReloadButton />
				<BugButton />
				{hadRecentError && isSubscribed && (
					<SubscribedOnly>
						<ResetToServer />
					</SubscribedOnly>
				)}
			</div>
		</div>
	);
}
