import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { Outlet } from 'react-router-dom';

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
