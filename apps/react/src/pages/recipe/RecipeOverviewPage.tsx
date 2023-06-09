import { RecipeOverview } from '@/components/recipes/viewer/RecipeOverview.jsx';
import { useParams } from '@verdant-web/react-router';

export interface RecipeOverviewPageProps {}

export function RecipeOverviewPage({}: RecipeOverviewPageProps) {
	const { slug } = useParams();

	return (
		<>
			<RecipeOverview slug={slug as string} />
		</>
	);
}

export default RecipeOverviewPage;
