import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { Outlet } from '@verdant-web/react-router';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	return (
		<PageRoot>
			<PageContent nav>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default RecipeViewPage;
