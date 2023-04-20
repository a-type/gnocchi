import { trpc, trpcClientOptions } from '@/trpc.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import classNames from 'classnames';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import * as classes from './App.css.js';
import { Pages } from './pages/Pages.jsx';
import { Provider as GroceriesProvider } from './stores/groceries/Provider.jsx';
import { IconSpritesheet } from './components/icons/generated/IconSpritesheet.jsx';
import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { GlobalLoader } from '@/GlobalLoader.jsx';
import { lemonTheme } from '@aglio/ui/styles';
import { useVisualViewportOffset } from '@aglio/ui/hooks';
import { ErrorBoundary } from '@aglio/ui/components/errorBoundary';
import { TooltipProvider } from '@aglio/ui/components/tooltip';
import { Box } from '@aglio/ui/components/box';
import { P, H1 } from '@aglio/ui/components/typography';
import { ParticleLayer } from '@aglio/ui/components/particles';

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
		<div className={classNames(classes.wrapper, lemonTheme)}>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<TooltipProvider>
					<Suspense fallback={<GlobalLoader />}>
						<trpc.Provider client={trpcClient} queryClient={queryClient}>
							<QueryClientProvider client={queryClient}>
								<GroceriesProvider>
									<ParticleLayer>
										<Pages />
										<Toaster position="bottom-center" />
										<IconSpritesheet />
									</ParticleLayer>
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
