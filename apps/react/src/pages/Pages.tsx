import { LogoutNotice } from '@/components/auth/LogoutNotice.jsx';
import { SubscribedOnly } from '@/components/auth/SubscribedOnly.jsx';
import { BugButton } from '@/components/menu/BugButton.jsx';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { ResetToServer } from '@/components/sync/ResetToServer.jsx';
import { StartSignupDialog } from '@/components/sync/StartSignupDialog.jsx';
import { UpdatePrompt } from '@/components/updatePrompt/UpdatePrompt.jsx';
import { useIsSubscribed } from '@/hooks/useAuth.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import {
	Box,
	Button,
	FullScreenSpinner,
	H1,
	LinkButton,
	NavContextProvider,
	NowPlayingProvider,
	P,
	PageContent,
	PageRoot,
} from '@aglio/ui';
import { lazy, Suspense } from 'react';
import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useMatches,
} from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { GroceriesPage } from './groceries/GroceriesPage.js';
import { NotFoundPage } from './NotFoundPage.jsx';
import { GlobalLoader } from '@/GlobalLoader.jsx';

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
const RecipeCookPage = lazy(() => import('./recipe/cook/RecipeCookPage.jsx'));
const RecipeCookPrepPage = lazy(
	() => import('./recipe/cook/RecipeCookPrepPage.jsx'),
);
const RecipeCookStepsPage = lazy(
	() => import('./recipe/cook/RecipeCookStepsPage.jsx'),
);
const RecipeOverviewPage = lazy(
	() => import('./recipe/RecipeOverviewPage.jsx'),
);
const SubscriberFeaturesPage = lazy(
	() => import('./SubscriberFeaturesPage.jsx'),
);
const PrivacyPolicyPage = lazy(() => import('./PrivacyPolicy.jsx'));
const TermsAndConditionsPage = lazy(() => import('./TermsAndConditions.jsx'));
const TempAccessGroceriesPage = lazy(
	() => import('./groceries/TempAccessGroceriesPage.jsx'),
);
const PantryPage = lazy(() => import('./PantryPage.jsx'));
const RecipesPage = lazy(() => import('./recipe/RecipesPage.jsx'));
const VerifyPasswordResetPage = lazy(() => import('./VerifyPasswordReset.jsx'));

const router = createBrowserRouter([
	{
		element: <PageLayoutRoot />,
		errorElement: <ErrorFallback />,
		children: [
			{
				path: '/',
				element: <GroceriesPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/list/:listId',
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
						children: [
							{
								// back compat
								index: true,
								element: <RecipeCookStepsPage />,
							},
							{
								path: 'prep',
								element: <RecipeCookPrepPage />,
							},
							{
								path: 'steps',
								element: <RecipeCookStepsPage />,
							},
						],
					},
				],
				hasErrorBoundary: false,
			},
			{
				path: '/temp/:code/:listId',
				element: <TempAccessGroceriesPage />,
			},
			{
				path: '/temp/:code',
				element: <TempAccessGroceriesPage />,
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
				path: '/privacy-policy',
				element: <PrivacyPolicyPage />,
				handle: { nav: true },
				hasErrorBoundary: false,
			},
			{
				path: '/tos',
				element: <TermsAndConditionsPage />,
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
				<Suspense fallback={<FullScreenSpinner />}>
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
						<PageContent>
							<GlobalLoader />
						</PageContent>
					</PageRoot>
				}
			>
				<Outlet />
				<StartSignupDialog />
				<UpdatePrompt />
				<LogoutNotice />
			</Suspense>
			{showNav && <NavBar />}
		</>
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
