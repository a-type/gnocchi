import { PageContent } from '@aglio/ui/components/layouts';
import { Outlet } from '@verdant-web/react-router';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	return (
		<PageContent>
			<Outlet />
		</PageContent>
	);
}

export default RecipeViewPage;
