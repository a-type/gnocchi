import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { RecipeViewer } from '@/components/recipes/viewer/RecipeViewer.jsx';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link, useParams } from 'react-router-dom';

export interface RecipeViewPageProps {}

export function RecipeViewPage({}: RecipeViewPageProps) {
	const { slug } = useParams();

	return (
		<PageRoot>
			<PageContent>
				<Link to="/recipes" className={sprinkles({ display: 'block', mb: 2 })}>
					<ArrowLeftIcon /> Back
				</Link>
				<RecipeViewer slug={slug as string} />
			</PageContent>
		</PageRoot>
	);
}
