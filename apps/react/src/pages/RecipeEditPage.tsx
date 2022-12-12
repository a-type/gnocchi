import { PageContent, PageRoot } from '@/components/layouts/index.jsx';
import { RecipeEditor } from '@/components/recipes/editor/RecipeEditor.jsx';
import { sprinkles } from '@/styles/sprinkles.css.js';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link, useParams } from 'react-router-dom';

export interface RecipeEditPageProps {}

export function RecipeEditPage({}: RecipeEditPageProps) {
	const { slug } = useParams();

	return (
		<PageRoot>
			<PageContent>
				<Link
					to={`/recipes/${slug}`}
					className={sprinkles({ display: 'block', mb: 2 })}
				>
					<ArrowLeftIcon /> Back
				</Link>
				<RecipeEditor slug={slug as string} />
			</PageContent>
		</PageRoot>
	);
}
