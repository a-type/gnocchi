import { hooks } from '@/stores/recipes/index.js';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export function RecipesSync() {
	const client = hooks.useClient();

	useEffect(() => {
		client.sync.start();
		return () => {
			client.sync.stop();
		};
	}, [client]);

	return <Outlet />;
}
