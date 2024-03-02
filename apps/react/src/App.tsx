import { trpc, trpcClientOptions } from '@/trpc.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import classNames from 'classnames';
import { Suspense, useLayoutEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Pages } from './pages/Pages.jsx';
import { Provider as GroceriesProvider } from './stores/groceries/Provider.jsx';
import { IconSpritesheet } from '@a-type/ui/components/icon';
import { ReloadButton } from '@/components/sync/ReloadButton.jsx';
import { GlobalLoader } from '@/GlobalLoader.jsx';
import { useVisualViewportOffset } from '@a-type/ui/hooks';
import { ErrorBoundary } from '@a-type/ui/components/errorBoundary';
import { TooltipProvider } from '@a-type/ui/components/tooltip';
import { P, H1, H2 } from '@a-type/ui/components/typography';
import { ParticleLayer } from '@a-type/ui/components/particles';
import { GlobalSyncingIndicator } from '@/components/sync/GlobalSyncingIndicator.jsx';

export function App() {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => trpc.createClient(trpcClientOptions));

	useLayoutEffect(() => {
		if (typeof window !== 'undefined') {
			document.body.className = 'theme-lemon';
		}
	}, []);

	useVisualViewportOffset();

	return (
		<div
			className={classNames(
				'flex flex-col flex-1 w-full h-full',
				'theme-lemon',
			)}
		>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<TooltipProvider>
					<Suspense fallback={<GlobalLoader />}>
						<trpc.Provider client={trpcClient} queryClient={queryClient}>
							<QueryClientProvider client={queryClient}>
								<GroceriesProvider>
									<ParticleLayer>
										<Pages />
										<Toaster
											position="bottom-center"
											containerClassName="mb-10 sm:mb-0"
										/>
										<IconSpritesheet />
										<GlobalSyncingIndicator />
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
		<div className="flex flex-col items-center justify-center p-4">
			<div className="flex flex-col items-start justify-center gap-4 max-w-700px">
				<H1>Something went wrong</H1>
				<P>
					Sorry about this. The app has crashed. You can try refreshing, but if
					that doesn't work,{' '}
					<a className="underline font-bold" href="mailto:hi@gnocchi.club">
						let me know about it.
					</a>
				</P>
				<ReloadButton />
			</div>
		</div>
	);
}
