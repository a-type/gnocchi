import { trpc, trpcClientOptions } from '@/trpc.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import * as classes from './App.css.js';

import {
	Box,
	Button,
	ErrorBoundary,
	H1,
	P,
	TooltipProvider,
	useVisualViewportOffset,
} from '@aglio/ui';

import { lemonTheme } from '@aglio/ui';
import { Pages } from './pages/Pages.jsx';
import { Provider as GroceriesProvider } from './stores/groceries/Provider.jsx';
import { IconSpritesheet } from './components/icons/generated/IconSpritesheet.jsx';
import { ReloadButton } from '@/components/sync/ReloadButton.jsx';

export function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));

	useLayoutEffect(() => {
		if (typeof window !== 'undefined') {
			document.body.className = lemonTheme;
		}
	}, []);

	useVisualViewportOffset();

	return (
		<div className={clsx(classes.wrapper, lemonTheme)}>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<TooltipProvider>
					<Suspense fallback={<GlobalSuspended />}>
						<trpc.Provider client={trpcClient} queryClient={queryClient}>
							<QueryClientProvider client={queryClient}>
								<GroceriesProvider>
									<Pages />
									<Toaster position="bottom-center" />
									<IconSpritesheet />
								</GroceriesProvider>
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
				<ReloadButton />
			</Box>
		</Box>
	);
}

function GlobalSuspended() {
	return (
		<div className={classes.fullSize}>
			<img src="/icon.png" className={classes.loaderIcon} />
		</div>
	);
}
