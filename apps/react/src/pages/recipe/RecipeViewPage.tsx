import { Button } from '@aglio/ui/components/button';
import { PageContent, PageRoot } from '@aglio/ui/components/layouts';
import { sprinkles } from '@aglio/ui/styles';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Outlet, useNavigate } from 'react-router-dom';

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
						alignSelf: 'flex-start',
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
