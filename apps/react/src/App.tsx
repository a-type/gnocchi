import { AuthProvider } from '@/contexts/AuthContext.js';
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
					<Suspense fallback={null}>
						<trpc.Provider client={trpcClient} queryClient={queryClient}>
							<QueryClientProvider client={queryClient}>
								<AuthProvider>
									<GroceriesProvider>
										<Pages />
										<Toaster position="bottom-center" />
										<IconSpritesheet />
									</GroceriesProvider>
								</AuthProvider>
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
