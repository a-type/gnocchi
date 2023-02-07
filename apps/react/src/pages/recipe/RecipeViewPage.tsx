import { PageContent, PageRoot } from '@aglio/ui';
import { NavBar } from '@/components/nav/NavBar.jsx';
import { Button } from '@aglio/ui';
import { sprinkles } from '@aglio/ui';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	const navigate = useNavigate();

	return (
		<PageRoot>
			<PageContent nav>
				<Button
					color="ghost"
					onClick={() => navigate(-1)}
					className={sprinkles({
						display: 'flex',
						flexDirection: 'row',
						gap: 2,
						mb: 2,
						alignSelf: 'start',
					})}
				>
					<ArrowLeftIcon /> Back
				</Button>
				<Outlet />
			</PageContent>
		</PageRoot>
	);
}

export default RecipeViewPage;
