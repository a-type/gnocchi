import { useIsSubscribed } from '@/contexts/AuthContext.jsx';
import { hooks, recipesDescriptor } from '@/stores/recipes/index.js';
import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export function RecipesSync() {
	return (
		<Suspense>
			<hooks.Provider value={recipesDescriptor}>
				<RecipesSyncContent />
			</hooks.Provider>
		</Suspense>
	);
}

export function RecipesSyncContent() {
	const client = hooks.useClient();
	const isSubscribed = useIsSubscribed();

	useEffect(() => {
		if (isSubscribed) {
			client.sync.start();
			return () => {
				client.sync.stop();
			};
		}
	}, [client, isSubscribed]);

	return <Outlet />;
}
