import { RecipeCookProvider } from '@/components/recipes/viewer/RecipeCookContext.jsx';
import { useWakeLock } from '@/hooks/useWakeLock.js';
import { Outlet, useParams } from '@lo-fi/react-router';

export interface RecipeCookPageProps {}

export function RecipeCookPage({}: RecipeCookPageProps) {
	const params = useParams();
	const slug = params.slug as string;

	useWakeLock(true);

	return (
		<RecipeCookProvider slug={slug}>
			<Outlet />
		</RecipeCookProvider>
	);
}

export default RecipeCookPage;
