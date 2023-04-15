import { LogoutNotice } from '@/components/auth/LogoutNotice.jsx';
import { SubscribedOnly } from '@/components/auth/SubscribedOnly.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { ResetToServer } from '@/components/sync/ResetToServer.jsx';
import { StartSignupDialog } from '@/components/sync/StartSignupDialog.jsx';
import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { lazy, Suspense } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { GroceriesPage } from './groceries/GroceriesPage.js';
import { NotFoundPage } from './NotFoundPage.jsx';
import { GlobalLoader } from '@/GlobalLoader.jsx';
import {
	NavContextProvider,
	NowPlayingProvider,
	PageContent,
	PageRoot,
} from '@aglio/ui/components/layouts';
import { FullScreenSpinner } from '@aglio/ui/components/spinner';
import { Box } from '@aglio/ui/components/box';
import { H1, P } from '@aglio/ui/components/typography';
import { Button } from '@aglio/ui/components/button';
import { LinkButton } from '@/components/nav/Link.jsx';
import { lazyWithPreload } from 'react-lazy-with-preload';
import { makeRoutes, Outlet, Router } from '@lo-fi/react-router';
import { ErrorBoundary } from '@aglio/ui/src/components/errorBoundary';
import { TopLoader } from '@/components/nav/TopLoader.jsx';

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
const RecipeViewPage = lazyWithPreload(
	() => import('./recipe/RecipeViewPage.jsx'),
);
const RecipeEditPage = lazyWithPreload(
	() => import('./recipe/RecipeEditPage.jsx'),
);
const RecipeCookPage = lazyWithPreload(
	() => import('./recipe/cook/RecipeCookPage.jsx'),
);
const RecipeCookPrepPage = lazyWithPreload(
	() => import('./recipe/cook/RecipeCookPrepPage.jsx'),
);
const RecipeCookStepsPage = lazyWithPreload(
	() => import('./recipe/cook/RecipeCookStepsPage.jsx'),
);
const RecipeOverviewPage = lazyWithPreload(
	() => import('./recipe/RecipeOverviewPage.jsx'),
);
const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicy.jsx'));
const TermsAndConditionsPage = lazy(() => import('./TermsAndConditions.jsx'));
const TempAccessGroceriesPage = lazy(
	() => import('./groceries/TempAccessGroceriesPage.jsx'),
);
const PantryPage = lazyWithPreload(() => import('./PantryPage.jsx'));
const RecipesPage = lazyWithPreload(() => import('./recipe/RecipesPage.jsx'));
const VerifyPasswordResetPage = lazy(() => import('./VerifyPasswordReset.jsx'));

const routes = makeRoutes([
	{
		path: '/',
		exact: true,
		component: GroceriesPage,
	},
	{
		path: '/list/:listId',
		component: GroceriesPage,
	},
	{
		path: '/settings',
		component: PlanPage,
		onAccessible: PlanPage.preload,
	},
	{
		path: '/claim/:inviteId',
		component: ClaimInvitePage,
	},
	{
		path: '/purchased',
		component: PantryPage,
		onAccessible: PantryPage.preload,
	},
	{
		path: '/nevermind',
		component: NevermindPage,
	},
	{
		path: '/welcome',
		component: SplashPage,
	},
	{
		path: '/join',
		component: JoinPage,
	},
	{
		path: '/verify',
		component: VerifyEmailPage,
	},
	{
		path: '/admin',
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
		],
	},
	{
		path: '/recipes',
		exact: true,
		component: RecipesPage,
		onAccessible: RecipesPage.preload,
	},
	{
		path: '/recipes/:slug',
		component: RecipeViewPage,
		onAccessible: RecipeViewPage.preload,
		children: [
			{
				path: '',
				exact: true,
				component: RecipeOverviewPage,
				onAccessible: RecipeOverviewPage.preload,
			},
			{
				path: 'edit',
				component: RecipeEditPage,
				onAccessible: RecipeEditPage.preload,
			},
			{
				path: 'cook',
				component: RecipeCookPage,
				onAccessible: RecipeCookPage.preload,
				children: [
					{
						// back compat
						path: '',
						exact: true,
						component: RecipeCookStepsPage,
					},
					{
						path: 'prep',
						component: RecipeCookPrepPage,
						onAccessible: RecipeCookPrepPage.preload,
					},
					{
						path: 'steps',
						component: RecipeCookStepsPage,
						onAccessible: RecipeCookStepsPage.preload,
					},
				],
			},
		],
	},
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
		path: '/privacy-policy',
		component: PrivacyPolicyPage,
	},
	{
		path: '/tos',
		component: TermsAndConditionsPage,
	},
	{
		path: '',
		component: NotFoundPage,
	},
]);

export function Pages() {
	return (
		<NowPlayingProvider>
			<NavContextProvider>
				<ErrorBoundary fallback={<ErrorFallback />}>
					<Suspense fallback={<GlobalLoader />}>
						<Router routes={routes}>
							<TopLoader />
							<PageRoot>
								<Outlet />
								<StartSignupDialog />
								<UpdatePrompt />
								<LogoutNotice />
							</PageRoot>
							<NavBar />
						</Router>
					</Suspense>
				</ErrorBoundary>
			</NavContextProvider>
		</NowPlayingProvider>
	);
}

function ErrorFallback() {
	const isSubscribed = useIsSubscribed();
	const [lastErrorReload, setLastErrorReload] = useLocalStorage(
		'lastErrorReload',
		0,
	);

	const hadRecentError = lastErrorReload > Date.now() - 1000 * 60 * 60;

	const { updateServiceWorker } = useRegisterSW();

	const refresh = () => {
		setLastErrorReload(Date.now());
		updateServiceWorker();
		window.location.reload();
	};

	return (
		<Box align="center" justify="center" p={4}>
			<Box align="flex-start" justify="center" gap={4} maxWidth="content">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed.{' '}
					{hadRecentError
						? `Looks like refreshing didn't work either... I recommend reporting a bug using the button below.`
						: `You can try refreshing, but if
					that doesn't work, use the button below to report the issue.`}
				</P>
				<LinkButton to="/">Go Home</LinkButton>
				<Button onClick={refresh}>Refresh</Button>
				<BugButton />
				{hadRecentError && isSubscribed && (
					<SubscribedOnly>
						<ResetToServer />
					</SubscribedOnly>
				)}
			</Box>
		</Box>
	);
}
