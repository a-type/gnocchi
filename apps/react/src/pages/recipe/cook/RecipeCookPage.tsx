import { RecipesNowPlaying } from '@/components/recipes/nowPlaying/RecipesNowPlaying.jsx';
import { RecipeCookProvider } from '@/components/recipes/viewer/RecipeCookContext.jsx';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { Outlet, useParams } from '@verdant-web/react-router';
import { Suspense } from 'react';

export interface RecipeCookPageProps {}

export function RecipeCookPage({}: RecipeCookPageProps) {
	const params = useParams();
	const slug = params.slug as string;

	useWakeLock(true);

	return (
		<RecipeCookProvider slug={slug}>
			<Outlet />
			<Suspense>
				<RecipesNowPlaying />
			</Suspense>
		</RecipeCookProvider>
	);
}

export default RecipeCookPage;
