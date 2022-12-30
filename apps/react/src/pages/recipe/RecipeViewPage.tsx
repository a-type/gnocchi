import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { Button } from '@/components/primitives/index.js';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link, Outlet, useNavigate } from 'react-router-dom';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	const navigate = useNavigate();

	return (
		<PageRoot>
			<PageContent>
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
